import axios from "axios"


async function GerarToken(){
    const body = {
        grant_type: "client_credentials",
        scope: "syngw",
        client_id: "42be0567-faaa-44a6-886b-f12142b72ffd",
        client_secret: "d44d3d6a-39b8-4e27-bbaf-1b45843debc4",
        syndata: "TWpNMU9EYzVaakk1T0dSaU1USmxaalprWldFd00ySTFZV1JsTTJRMFptUT06WlhsS1ZHVlhOVWxpTTA0d1NXcHZhVnBZU25kTVdFNHdXVmRrY0dKdFkzVmhWelV3V2xoS2RWcFlVak5aV0d0MVdUSTVkRXh0U25sSmFYZHBWVE5zZFZKSFNXbFBhVXByV1cxV2RHTkVRWGROZW1ONVdETk9NRmxYWkhCaWJXTnBURU5LUlZsc1VqVmpSMVZwVDJsS2QySXpUakJhTTBwc1kzbEtPUT09OlpUaGtNak0xWWprMFl6bGlORE5tWkRnM01EbGtNalkyWXpBeE1HTTNNR1U9"
    }
    try {

       

        const result = await axios.post("https://erp-staging.internetway.com.br:45700/connect/token", body, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });


      

        if(result){
            return result.data.access_token;
        }


        return ""

        
        
    } catch (error) {
        console.log(error)
    }
}


export default GerarToken