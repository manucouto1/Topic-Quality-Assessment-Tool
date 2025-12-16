

export default function NiceBox({ children, fromColor, toColor, fromPerc, toPerc }){
    return(
        <div className="w-full h-full relative group/chats py-1 ml-1.5 pr-0.5">
            <div className={`w-full absolute float-left -inset-0.5 bg-gradient-to-r ${fromColor} ${toColor} ${fromPerc} ${toPerc} rounded-lg blur 
            opacity-75 group-hover/chats:opacity-100 transition duration-1000 group-hover/chats:duration-200 animate-tilt my-1.5 ml-0.5`}/>
            <div className=" h-full bg-slate-950 backdrop-blur-2xl
            border-neutral-800  static w-auto rounded-xl 
            border py-2">
                <div className="h-full w-full flex flex-col gap-1 px-2 justify-between py-1">
                    {children}
                </div>
            </div>
        </div>
    )
}