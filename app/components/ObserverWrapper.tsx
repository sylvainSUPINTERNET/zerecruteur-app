'use client';

import { useRouter } from "next/router";
import { useState, useEffect, createContext, useContext } from "react";


let debounceTimer: string | number | NodeJS.Timeout | undefined;

const debounce = (func:any, delay:any) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(func, delay);
}

export const ApiKeyProvider = ({config, children}: {config: {
    apiKey: string,
    options: {
        firstImpressions: boolean
    }
}, children:any}) => {
    return <ApiKeyContext.Provider value={config}>{children}</ApiKeyContext.Provider>;
}
const ApiKeyContext = createContext<any>(ApiKeyProvider);


const parseUrlParams = () => {
    //?utm_source=facebook&utm_medium=social&utm_campaign=product_launch
    const urlParams = new URLSearchParams(window.location.search);
    const utm_source = urlParams.get("utm_source");
    const utm_medium = urlParams.get("utm_medium");
    const utm_campaign = urlParams.get("utm_campaign");

    // console.log(utm_source, utm_medium, utm_campaign);
}

const getBrowserPlatformDetails = () => {
    // console.log(window.navigator);
    // user agent 
    // vendor 
    // language 
    // platform
}

const sendMetrics = async ( ) => {
    console.log("Send metrics");
    // const res = await fetch('http://localhost:9000/api/metrics', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //         applicationId: "",
    //         fromUrl: "",
    //         elements: [
    //             {
    //                 id: "",
    //                 htmlTag: "",
    //                 action: {
    //                     "name":"",
    //                     "count": 1
    //                 }
    //             }
    //         ]
    //     })
    // });
    // const json = await res.json()
    // console.log(json)
}


// const countFirstImpressionPerPage = () => {

//     const prefixCookieName = btoa("MY_APP_NAME");

//     const cookieName = `${prefixCookieName}`;
//     let cleaned = cookieName.replace("=", "").replace(";", "").replace("/", "").replace("_","");

//         // Check if the cookie already exists
//     if (document.cookie.indexOf(cleaned) === -1) {
//         const expirationDays = 30; // 30 days expiration
//         const expirationDate = new Date();
//         expirationDate.setTime(expirationDate.getTime() + expirationDays * 24 * 60 * 60 * 1000);
//         const cookieString = `${cleaned}=${window.location.pathname}; expires=${expirationDate.toUTCString()}; path=/`;
//         document.cookie = cookieString;
//     } else {
//         const existingCookie = document.cookie.split("; ").find((cookie) => cookie.startsWith(`${cleaned}=`));
//         console.log("existing cookie ?3", existingCookie);

//         if ( existingCookie ) {

//             const existingValue = existingCookie.split("=")[1];
//             const pathsArray = existingValue.split(","); // Split the value into an array of paths
      
//             // Check if the current path already exists in the array of paths
//             const isPathAlreadyPresent = pathsArray.includes(window.location.pathname);
      
//             if (!isPathAlreadyPresent) {
//               // If the path is not already present, add it to the array and update the cookie
//               pathsArray.push(window.location.pathname);
//               const newValue = pathsArray.join(","); // Join the array back to a comma-separated string
//               const expirationDays = 30; // 30 days expiration
//               const expirationDate = new Date();
//               expirationDate.setTime(expirationDate.getTime() + expirationDays * 24 * 60 * 60 * 1000);
//               const cookieString = `${cleaned}=${newValue}; expires=${expirationDate.toUTCString()}; path=/`;
//               document.cookie = cookieString;


//         }
//     }

    
//     }
// }


export default function ObserverWrapper({ children, threshold = 0.1, ...props }: any) {
    const contextApi = useContext(ApiKeyContext);
    const [color, setColor] = useState("bg bg-blue-500");
    let supportedEvents = ["click", "mouseover"];


    if ( !contextApi) {
        console.error("Context for API wrong") 
    };


    // send data to topic
    // rate limit https://www.npmjs.com/package/express-rate-limit
    // setup key system to avoid les fdp

    useEffect( () => {

        supportedEvents.forEach( (event) => {

            // TODO update ici ( faire une boucle pour gérer tous les event des element enfant d'efnat etc)
            document.querySelector('#'+children.props.id)!.addEventListener(event, (e:any) => {
                console.log("====================================")
                // console.log(`${event} : ${children.props.id} - ${window.location.href}`);
                // parseUrlParams();
                // getBrowserPlatformDetails();
                debounce(sendMetrics(), 5000);
                console.log("====================================")

            });

        });

        let observer = new IntersectionObserver((entries:any) => {
            
            if ( entries[0].isIntersecting ) {
                setColor("bg bg-red-500");
                console.log("Intercepted : #" + entries[0].target.id)
            } else {
                setColor("bg bg-blue-500");
            }

        }, { threshold: 1.0 });
        observer.observe(document.querySelector('#'+children.props.id)!);

        return () => {
            observer.disconnect();
        }

    }, []); 

    return ( 
        <div className={color}>
            {children}
        </div>
    )};