
import { RiDeleteBin6Line } from "react-icons/ri";

function RecentSearch({recentHistory, setRecentHistory,setSelectedHistory}) {

    const clearHistory = () => {
        localStorage.clear();
        setRecentHistory([])
      }

    const clearSelectedHistory=(selectedItem)=>{
        let history = JSON.parse(localStorage.getItem('history'));
        console.log(history);
       history= history.filter((item)=>{
           if(item!=selectedItem){
            return item
           }
        })
        setRecentHistory(history)
        localStorage.setItem('history',JSON.stringify(history));
        console.log(history);
        
    }

    return (
        <>
            <div className='col-span-1 bg-zinc-700 pt-3 rounded-xl'>
                <h1 className='text-xl text-white  flex text-center justify-center '>
                    <span>Recent Search</span>
                    <button onClick={clearHistory} className='cursor-pointer'><RiDeleteBin6Line className="text-red-500" />
                    </button>
                </h1>
                <ul className='text-left overflow-auto mt-2'>
                    {
                        recentHistory && recentHistory.map((item, index) => (
                            <div className="flex justify-between pr-3 py-1">
                            <li key={index} onClick={() => setSelectedHistory(item)} className=' w-full pl-5 px-5 truncate text-white cursor-pointer' >{item}</li>
                    <button onClick={()=>clearSelectedHistory(item)} className='cursor-pointer hover:bg-zinc-900 bg-zinc-700 '> <RiDeleteBin6Line className="text-red-500" /> </button>
                    </div>
                        ))
                    }
                </ul>
            </div>
        </>
    )

}

export default RecentSearch;