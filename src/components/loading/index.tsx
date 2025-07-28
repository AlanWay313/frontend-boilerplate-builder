
import ld from "@/assets/C (4).gif"


export function Loading(){
    return (
        <div className="w-full h-screen flex items-center justify-center fixed top-0 left-0 z-30 bg-white/40">
            <img src={ld} alt="loadind" />
        </div>
    )
}