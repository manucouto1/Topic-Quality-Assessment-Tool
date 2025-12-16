import argparse
import os
import random
import sys
from typing import List

import pandas as pd
from dotenv import load_dotenv

sys.path.append("..")
sys.path.append("../backend")
from backend.model.topic import TopicModel, UserEvaluationDao, UserEvaluationModel
from backend.model.user import UserDao, UserModel


# Cargar variables de entorno
load_dotenv()

evaluations = []


def prepare_topics_to_evaluate():
    """
    Prepara los tópicos a evaluar desde archivos configurados en .env
    """
    global evaluations
    evaluations = []

    # Leer configuración desde .env
    results_file = os.getenv("RESULTS_FILE")
    topics_file = os.getenv("TOPICS_FILE")
    prob_column = os.getenv("PROB_COLUMN", "prob")
    cluster_column = os.getenv("CLUSTER_COLUMN", "clusters")
    top_k: int = int(os.getenv("TOP_K_DOCS", 5))

    if not results_file or not topics_file:
        print("✗ Error: Define RESULTS_FILE y TOPICS_FILE en .env")
        return

    if not os.path.exists(results_file):
        print(f"✗ Error: Archivo no encontrado: {results_file}")
        return

    if not os.path.exists(topics_file):
        print(f"✗ Error: Archivo no encontrado: {topics_file}")
        return

    print(f"📂 Cargando resultados desde: {results_file}")
    print(f"📂 Cargando tópicos desde: {topics_file}")

    # Cargar archivos
    results_df = pd.read_csv(results_file, lineterminator="\n")
    topics_df = pd.read_csv(topics_file)

    print(f"✓ Results: {len(results_df)} documentos")
    print(f"✓ Topics: {len(topics_df.columns)} tópicos")

    # Verificar columnas
    if prob_column not in results_df.columns:
        print(f"✗ Error: Columna '{prob_column}' no encontrada en {results_file}")
        print(f"   Columnas disponibles: {list(results_df.columns)}")
        return

    if cluster_column not in results_df.columns:
        print(f"✗ Error: Columna '{cluster_column}' no encontrada en {results_file}")
        print(f"   Columnas disponibles: {list(results_df.columns)}")
        return

    # Ordenar por probabilidad
    sorted_df = results_df.sort_values(by=prob_column, ascending=False)

    # Iterar sobre cada tópico
    for topic_id in topics_df.columns:
        try:
            topic_num = int(topic_id)

            # Obtener top-k documentos más centrales para este cluster
            top_docs = (
                sorted_df.loc[sorted_df[cluster_column] == topic_num]
                .head(top_k)
                .text.astype(str)
                .values.tolist()
            )

            # Obtener palabras top del tópico
            top_words = topics_df[str(topic_id)].astype(str).values.tolist()

            evaluations.append(
                TopicModel(
                    model_name="model",  # Placeholder
                    database_name="dataset",  # Placeholder
                    k=len(topics_df.columns),
                    topic_number=int(topic_id),
                    top_words=(top_words, None),
                    ordered_docs=(top_docs, None),
                )
            )
        except Exception as e:
            print(f"⚠ Error procesando tópico {topic_id}: {e}")
            continue

    print(f"✓ Preparados {len(evaluations)} tópicos")


def list_users():
    """Lista todos los usuarios disponibles."""
    users = UserDao.findAll()

    if not users:
        print("No hay usuarios en la base de datos")
        return []

    print("\n=== Usuarios disponibles ===")
    for idx, user in enumerate(users, 1):
        user_model = UserModel(**user)
        evals = UserEvaluationDao.find_by_user(str(user_model.id))
        eval_count = len(list(evals)) if evals else 0
        print(f"{idx}. {user_model.username} (evaluaciones: {eval_count})")

    return [UserModel(**u).username for u in users]


def select_users_interactive() -> List[str]:
    """Permite seleccionar usuarios de forma interactiva."""
    usernames = list_users()

    if not usernames:
        return []

    print("\nOpciones:")
    print("  - Números separados por comas (ej: 1,3,5)")
    print("  - Rangos (ej: 1-3)")
    print("  - 'all' para todos")

    selection = input("\nSelecciona usuarios: ").strip()

    if selection.lower() == "all":
        return usernames

    selected = set()
    for part in selection.split(","):
        part = part.strip()
        if "-" in part:
            start, end = map(int, part.split("-"))
            selected.update(range(start, end + 1))
        else:
            selected.add(int(part))

    return [usernames[i - 1] for i in sorted(selected) if 0 < i <= len(usernames)]


def reset_users(usernames: List[str]):
    """Elimina todas las evaluaciones de los usuarios especificados."""
    for username in usernames:
        user_data = UserDao.find_by_username(username)
        if not user_data:
            print(f"✗ Usuario '{username}' no encontrado")
            continue

        user = UserModel(**user_data)
        evals = list(UserEvaluationDao.find_by_user(str(user.id)))

        if not evals:
            print(f"✓ {username}: sin evaluaciones previas")
            continue

        ids_to_delete = [str(e["_id"]) for e in evals]
        UserEvaluationDao.delete_many(ids_to_delete)

        # Verificar eliminación
        remaining = list(UserEvaluationDao.find_by_user(str(user.id)))
        if remaining:
            print(f"✗ {username}: quedan {len(remaining)} evaluaciones")
        else:
            print(f"✓ {username}: eliminadas {len(ids_to_delete)} evaluaciones")


def insert_topics_for_users(usernames: List[str], description: str | None = None):
    """Inserta evaluaciones para los usuarios especificados."""
    if not evaluations:
        print("✗ No hay tópicos preparados. Usa --prepare primero")
        return

    desc = description or f"Evaluación con {len(evaluations)} tópicos"

    for username in usernames:
        user_data = UserDao.find_by_username(username)
        if not user_data:
            print(f"✗ Usuario '{username}' no encontrado")
            continue

        user = UserModel(**user_data)

        # Mezclar evaluaciones para cada usuario
        shuffled_evals = evaluations.copy()
        random.shuffle(shuffled_evals)

        user_eval = UserEvaluationModel(
            user=user.id,
            description=desc,
            evaluation=shuffled_evals,
        )

        UserEvaluationDao.create(user_eval)
        print(f"✓ {username}: insertadas {len(shuffled_evals)} evaluaciones")


def main():
    parser = argparse.ArgumentParser(
        description="Gestión de evaluaciones de tópicos para usuarios",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Ejemplos:
  # Listar usuarios
  %(prog)s --list
  
  # Preparar e insertar de forma interactiva
  %(prog)s --prepare --interactive --insert
  
  # Pipeline completo con usuarios específicos
  %(prog)s --prepare --reset user1 user2 --insert user1 user2
  
Variables de entorno requeridas (.env):
  RESULTS_FILE      Ruta al CSV con documentos y probabilidades
  TOPICS_FILE       Ruta al CSV con tópicos (palabras por columna)
  PROB_COLUMN       Nombre columna de probabilidad (default: prob)
  CLUSTER_COLUMN    Nombre columna de cluster (default: clusters)
  TOP_K_DOCS        Documentos top por tópico (default: 5)
        """,
    )

    # Acciones principales
    parser.add_argument("--list", action="store_true", help="Listar todos los usuarios")
    parser.add_argument(
        "--interactive",
        "-i",
        action="store_true",
        help="Modo interactivo para seleccionar usuarios",
    )
    parser.add_argument(
        "--prepare",
        action="store_true",
        help="Preparar tópicos desde archivos configurados en .env",
    )

    # Operaciones sobre usuarios
    parser.add_argument(
        "--reset",
        nargs="*",
        metavar="USER",
        help="Resetear usuarios (eliminar evaluaciones)",
    )
    parser.add_argument(
        "--insert",
        nargs="*",
        metavar="USER",
        help="Insertar evaluaciones para usuarios",
    )
    parser.add_argument(
        "--description", "-d", help="Descripción para las evaluaciones insertadas"
    )

    args = parser.parse_args()

    # Validación
    if not any(
        [args.list, args.prepare, args.reset is not None, args.insert is not None]
    ):
        parser.print_help()
        return

    # Modo lista
    if args.list:
        list_users()
        return

    # Preparar tópicos
    if args.prepare:
        prepare_topics_to_evaluate()

    # Determinar usuarios objetivo
    target_users = []

    if args.interactive:
        target_users = select_users_interactive()
        if not target_users:
            print("No se seleccionaron usuarios")
            return

    # Reset
    if args.reset is not None:
        users_to_reset = args.reset if args.reset else target_users
        if not users_to_reset:
            print("✗ Especifica usuarios con --reset USER1 USER2 o usa --interactive")
            return

        confirm = input(f"¿Resetear {len(users_to_reset)} usuarios? [y/N]: ")
        if confirm.lower() == "y":
            reset_users(users_to_reset)

    # Insert
    if args.insert is not None:
        users_to_insert = args.insert if args.insert else target_users
        if not users_to_insert:
            print("✗ Especifica usuarios con --insert USER1 USER2 o usa --interactive")
            return

        insert_topics_for_users(users_to_insert, args.description)


if __name__ == "__main__":
    main()
