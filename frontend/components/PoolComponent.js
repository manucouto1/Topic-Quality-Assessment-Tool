import { NEXT_URL } from "@/config";
import { map } from "lodash"
import { useEffect, useState } from "react"
import { toast } from "react-toastify";


export default function PoolComponent({work}){
    const [topic, setTopic] = useState(work.evaluation[work.last_index])
    const [topicNum, setTopicNum] = useState(work.last_index)
    const [selectedOption, setSelectedOption] = useState(undefined);
    const [selectedOption2, setSelectedOption2] = useState(undefined);
    const [selectedOption3, setSelectedOption3] = useState(undefined);
    const [inputValue, setInputValue] = useState(work.evaluation[topicNum].top_words_desc)
    const [inputValue2, setInputValue2] = useState(work.evaluation[topicNum].top_docs_desc)

    useEffect(()=>{
        setTopic(work.evaluation[topicNum])
        setSelectedOption(work.evaluation[topicNum].top_words.at(-1))
        setSelectedOption2(work.evaluation[topicNum].ordered_docs.at(-1))
        setSelectedOption3(work.evaluation[topicNum].overall_coh)
        setInputValue(work.evaluation[topicNum].top_words_desc)
        setInputValue2(work.evaluation[topicNum].top_docs_desc)
    },[work, topicNum])


    const selector_fun = (event) => {
        const value = parseInt(event.target.value);
        setSelectedOption(value)
    }

    const selector_fun2 = (event) => {
        const value = parseInt(event.target.value);
        setSelectedOption2(value)
    }

    const selector_fun3 = (event) => {
        const value = parseInt(event.target.value);
        setSelectedOption3(value)
    }

    const check_condition = () => {
        return (topic.top_words.at(-1) != selectedOption || 
        topic.ordered_docs.at(-1) != selectedOption2 || 
        topic.overall_coh != selectedOption3 || 
        topic.top_words_desc != inputValue || 
        topic.top_docs_desc != inputValue2)
    }
    const next = () => {
        if (check_condition()) {
            submit_evaluation()
        } else {
            setTopicNum(topicNum + 1)
        }

    }

    const submit_evaluation = ()=>{
        topic.top_words.splice(1, 1, selectedOption)
        topic.ordered_docs.splice(1, 1, selectedOption2)
        topic.overall_coh = selectedOption3
        topic.top_words_desc = inputValue
        topic.top_docs_desc = inputValue2
        

        fetch(`${NEXT_URL}/api/topic/update`, { 
            cache: 'no-store',
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
                _id: work._id,
                topicNum: topicNum,
                lastIndex: (topicNum<work.evaluation.length-1)? topicNum + 1:topicNum,
                evaluation: topic,
            })
        
        })
        .then((res) => res.json())
        .then((data) => {
            if (data?.ok){
                toast.success("Evaluation updated")
                if (topicNum < work.evaluation.length -1 ){
                    work.last_index = topicNum + 1
                    setTopicNum(topicNum + 1)
                }
                
            } else {
                toast.error("Error updating topic evaluation")
            }
            
        })
    }

    return (work == undefined)?(
        <div>
            No evaluation session selected
        </div>
    ):(
        <div className='w-full h-full flex flex-col border-white'>
            <div className="h-full w-full flex flex-row z-50 gap-4">
                <div className={`w-full h-full flex flex-col justify-between overflow-y-auto overflow-hidden scrollbar-hide relative z-50 `}>
                    <div>
                        <div className="w-full">
                            <div className='p-2 pt-4'>
                                <h1 className="text-xl border-b-2">
                                    Evalúa la coherencia de esta lista de palabras:
                                </h1>
                                <div className="text-slate-400 pt-2">1 - Valora la siguiente lista de palabras y estima globalmente su coherencia para definir un tópico.</div>
                            </div>
                            <div className='p-2 flex justify-between gap-2'>

                                <div className="flex">
                                    <div className="gap-2 flex px-2">
                                        {(topic)&&map(topic.top_words[0], (word,idx) => <div className="py-1 px-2 bg-slate-900 min-w-20 text-center rounded-xl" key={idx}>{word}</div>)}
                                    </div>
                                </div>

                                <div className="flex gap-4 border-l-2 px-4 my-auto">
                                    <div className="inline-flex items-center">
                                        <label className="relative flex items-center cursor-pointer" htmlFor="1">
                                            <input name="framework" type="radio" className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all" id="1" 
                                                value={1}
                                                checked={selectedOption === 1} 
                                                onChange={selector_fun}
                                            />
                                            <span className="absolute bg-slate-300 w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"/>
                                        </label>
                                        <label className="ml-2 text-slate-400 cursor-pointer text-sm" htmlFor="1">Incoherente</label>
                                    </div>
                                    
                                    <div className="inline-flex items-center">
                                        <label className="relative flex items-center cursor-pointer" htmlFor="2">
                                            <input name="framework" type="radio" className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all" id="2" 
                                                value={2} 
                                                checked={selectedOption === 2} 
                                                onChange={selector_fun}
                                            />
                                            <span className="absolute bg-slate-300 w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"/>
                                        </label>
                                        <label className="ml-2 text-slate-400 cursor-pointer text-sm" htmlFor="2">Moderadamente coherente</label>
                                    </div>

                                    <div className="inline-flex items-center">
                                        <label className="relative flex items-center cursor-pointer" htmlFor="3">
                                        <input name="framework" type="radio" className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all" id="3" 
                                            value={3} 
                                            checked={selectedOption === 3} 
                                            onChange={selector_fun}
                                        />
                                        <span className="absolute bg-slate-300 w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                        </span>
                                        </label>
                                        <label className="ml-2 text-slate-400 cursor-pointer text-sm" htmlFor="3">Muy coherente</label>
                                    </div>
                                </div>
                            </div>
                            <div className="py-2">
                                <div className="text-slate-400 p-2">2 - Si lo ves posible, escribe un nombre para el tópico asociado a la lista de palabras anterior (deja la respuesta vacía si entiendes que no es posible imputarle un nombre).</div>
                                <div className="w-full px-2">
                                    <input className="py-2 w-full px-2 bg-slate-900 rounded-xl " type="text" label="text" placeholder=" ..." 
                                        onChange={(e)=>{
                                            setInputValue(e.target.value)
                                            
                                        }}
                                        value={(inputValue != undefined)?inputValue:""}
                                    />    
                                </div>
                            </div>
                        </div>
                        
                        <div className={`${(selectedOption==undefined)&&"hidden"}`}>
                            <div className="border-b-2 p-2 pt-4 h-full">
                                <h1 className="text-xl border-b-2">
                                    Evalúa la coherencia de esta lista de textos:
                                </h1>
                                <div id="test" className="py-1 group/chats pt-4">
                                    <div className="h-full  w-auto ">
                                        <div className='h-full'>
                                            <ul className="h-full w-full flex flex-col gap-2 m-auto">
                                                {
                                                    (topic)&&map(topic.ordered_docs[0], (doc, idx) => {
                                                        return (
                                                            <li className="w-full" key={idx}>
                                                                <div className=" w-full block rounded-xl bg-slate-900 ">
                                                                    <div className="w-full font-semibold justify-start text-left ">
                                                                        <div className=" w-full flex justify-between gap-1">
                                                                            <div className=" w-full text-l  py-1 px-2 line-clamp-2">
                                                                            {
                                                                                map(doc.split(/\n/), (line, idx2) => <p  className="w-full " key={idx2}>{line}</p>)
                                                                            }
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex pt-2 pb-2 justify-between">
                                    
                                    <div className="text-slate-400 ">3 -  Valora ahora la siguiente lista de textos y estima globalmente su coherencia temática. </div>
                                    
                                    <div className="flex gap-4 border-l-2 px-4 my-auto">
                                        <div className="inline-flex items-center">
                                            <label className="relative flex items-center cursor-pointer" htmlFor="text-cohe-1">
                                                <input name="framework2" type="radio" className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all" id="text-cohe-1" 
                                                    value={1} 
                                                    checked={selectedOption2 === 1} 
                                                    onChange={selector_fun2}
                                                />
                                                <span className="absolute bg-slate-300 w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"/>
                                            </label>
                                            <label className="ml-2 text-slate-400 cursor-pointer text-sm" htmlFor="text-cohe-1">Incoherente</label>
                                        </div>
                                        
                                        <div className="inline-flex items-center">
                                            <label className="relative flex items-center cursor-pointer" htmlFor="text-cohe-2">
                                                <input name="framework2" type="radio" className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all" id="text-cohe-2" 
                                                    value={2} 
                                                    checked={selectedOption2 === 2} 
                                                    onChange={selector_fun2}
                                                />
                                                <span className="absolute bg-slate-300 w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"/>
                                            </label>
                                            <label className="ml-2 text-slate-400 cursor-pointer text-sm" htmlFor="text-cohe-2">Moderadamente coherente</label>
                                        </div>

                                        <div className="inline-flex items-center">
                                            <label className="relative flex items-center cursor-pointer" htmlFor="text-cohe-3">
                                            <input name="framework2" type="radio" className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all" id="text-cohe-3" 
                                                value={3} 
                                                checked={selectedOption2 === 3} 
                                                onChange={selector_fun2}
                                            />
                                            <span className="absolute bg-slate-300 w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                            </span>
                                            </label>
                                            <label className="ml-2 text-slate-400 cursor-pointer text-sm" htmlFor="text-cohe-3">Muy coherente</label>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="text-slate-400 pt-4">4 - Si lo ves posible, escribe un nombre temático para este grupo de textos (deja la respuesta vacía si entiendes que no es posible imputarle un nombre).</div>
                                {/* <div className="flex py-4">
                                    <input className="w-full px-2 bg-slate-900 rounded-l-xl mx-2" type="text" label="text" placeholder=" ..." onChange={(e)=>setInputValue2(e.target.value)} value={(inputValue2 != undefined)?inputValue2:""} />    
                                </div> */}
                                <div className="w-full px-2 py-2">
                                    <input className="py-2 w-full px-2 bg-slate-900 rounded-xl " type="text" label="text" placeholder=" ..." 
                                        onChange={(e)=>{
                                            setInputValue2(e.target.value)
                                            
                                        }}
                                        value={(inputValue2 != undefined)?inputValue2:""}
                                    />    
                                </div>

                                <div className="flex py-4 justify-between">
                                    <div className="text-slate-400 ">5 - Dirías que la lista de palabras y el grupo de textos guardan coherencia temática entre sí?</div>
                                    <div className="flex gap-4 border-l-2 px-4 my-auto">
                                        <div className="inline-flex items-center">
                                            <label className="relative flex items-center cursor-pointer" htmlFor="all-cohe-1">
                                                <input name="framework3" type="radio" className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all" id="all-cohe-1" 
                                                    value={1} 
                                                    checked={selectedOption3 === 1} 
                                                    onChange={selector_fun3}
                                                />
                                                <span className="absolute bg-slate-300 w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"/>
                                            </label>
                                            <label className="ml-2 text-slate-400 cursor-pointer text-sm" htmlFor="all-cohe-1">Incoherente</label>
                                        </div>
                                        
                                        <div className="inline-flex items-center">
                                            <label className="relative flex items-center cursor-pointer" htmlFor="all-cohe-2">
                                                <input name="framework3" type="radio" className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all" id="all-cohe-2" 
                                                    value={2} 
                                                    checked={selectedOption3 === 2} 
                                                    onChange={selector_fun3}
                                                />
                                                <span className="absolute bg-slate-300 w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"/>
                                            </label>
                                            <label className="ml-2 text-slate-400 cursor-pointer text-sm" htmlFor="all-cohe-2">Moderadamente coherente</label>
                                        </div>

                                        <div className="inline-flex items-center">
                                            <label className="relative flex items-center cursor-pointer" htmlFor="all-cohe-3">
                                            <input name="framework3" type="radio" className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all" id="all-cohe-3" 
                                                value={3} 
                                                checked={selectedOption3 === 3} 
                                                onChange={selector_fun3}
                                            />
                                            <span className="absolute bg-slate-300 w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                            </span>
                                            </label>
                                            <label className="ml-2 text-slate-400 cursor-pointer text-sm" htmlFor="all-cohe-3">Muy coherente</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative w-full h-[4rem] flex flex-row bg-transparent z-50 mt-4">
                        
                        <div className="m-auto  h-full flex flex-row gap-0.5 justify-between z-50 text-xs">
                            <button className="py-1 px-2 border font-bold rounded-l-xl  disabled:bg-gray-300 disabled:cursor-not-allowed hover:enabled:bg-slate-500 hover:enabled:border-slate-900 hover:enabled:text-black my-auto mr-2" 
                                    disabled={topicNum <= 0}
                                    onClick={()=>setTopicNum(topicNum - 1)}> Anterior </button>
                            {
                                map(work.evaluation, (p, idx) => {
                                    return <div key={idx} className={`m-auto p-0.5 w-1 min-h-5 bg-black ${(idx == 0 || idx == work.evaluation.length-1)&&"w-1 bg-slate-50"} ${(idx<=topicNum)?"bg-slate-400 w-1":""}` }></div>
                                })
                            }
                            <div className="m-auto text-xl px-4 w-[5rem]">{Math.round(topicNum / (work.evaluation.length-1) * 100)}%</div>
                            <button className="py-1 px-2 border font-bold rounded-r-xl  disabled:bg-gray-300 disabled:cursor-not-allowed hover:enabled:bg-slate-500 hover:enabled:border-slate-900 hover:enabled:text-black my-auto mr-2" 
                                    disabled={topicNum == work.evaluation.length-1}
                                    onClick={()=>next()}> Siguiente </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}