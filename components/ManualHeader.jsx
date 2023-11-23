import {useMoralis} from "react-moralis"
//for metamask connection
import {useEffect} from "react"
//for re-rendering when page is reloaded

export default function Home(){
    const {enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading} = useMoralis()

    useEffect(() => {
        if(isWeb3Enabled) return
        if(typeof window != "undefined"){
            if(window.localStorage.getItem("connected")){
                enableWeb3()
            }}
        
    },[])
    useEffect(() => {
       Moralis.onAccountChanged((account)=>{

        if(account == null){
            window.localStorage.removeItem("connected")
            deactivateWeb3()
        }
       })
        
    },[])


    return(<div>
        {account ? (<div>Connected to {account.slice(0,5)}..... {account.slice(account.length -5)}</div>) : 
        (<button onClick={async () => {
            await enableWeb3()
            if(typeof window != "undefined"){
        window.localStorage.setItem("connected", "injected")}
        
        }
            
            }
            //disabled={isWeb3EnableLoading} //yüklenirken basılamaz
            >Connect</button>)}
     
    </div>)
}