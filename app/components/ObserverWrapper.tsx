'use client';

import { useRouter } from "next/router";
import { useState, useEffect, createContext, useContext } from "react";


interface IMetricEvent {
    id: string,
    htmlTag: string,
    actions: [
        {
            name: string,
            count: number
        }
    ]
}

const updateCache = (cache:Array<IMetricEvent>, metric:IMetricEvent):Array<IMetricEvent>  => {
    if (cache.length === 0) {
        return [metric];
    }

    let found = false;

    for (const cachedMetric of cache) {
        if (cachedMetric.id === metric.id && cachedMetric.htmlTag === metric.htmlTag) {
            let actionFound = false;
            for (let i = 0; i < cachedMetric.actions.length; i++) {
                if (cachedMetric.actions[i].name === metric.actions[0].name) {
                    cachedMetric.actions[i].count += metric.actions[0].count;
                    actionFound = true;
                    break;
                }
            }

            if (!actionFound) {
                cachedMetric.actions.push(metric.actions[0]);
            }

            found = true;
            break;
        }
    }

    if (!found) {
        cache.push(metric);
    }

    return cache;
}

export const ApiKeyProvider = ({config, children}: {config: {
    apiKey: string,
    applicationId: string,
    options: {
        firstImpressions: boolean
    }
}, children:any}) => {
    return <ApiKeyContext.Provider value={config}>{children}</ApiKeyContext.Provider>;
}
const ApiKeyContext = createContext<any>(ApiKeyProvider);


const parseUrlParams = async () => {
    //?utm_source=facebook&utm_medium=social&utm_campaign=product_launch
    const urlParams = new URLSearchParams(window.location.search);
    const utm_source = urlParams.get("utm_source");
    const utm_medium = urlParams.get("utm_medium");
    const utm_campaign = urlParams.get("utm_campaign");

    // console.log(utm_source, utm_medium, utm_campaign);
}

const getBrowserPlatformDetails = async () => {
    // console.log(window.navigator);
    // user agent 
    // vendor 
    // language 
    // platform
}

/**
 * Data related to the DOM ( click, mouseover, etc)
 */
const sendMetrics = async ( contextApi:any, domElementId: string, timerEventsCache:Array<IMetricEvent>) => {
    if ( timerEventsCache.length === 0 ) return timerEventsCache;

    try {

        console.log("Send DOM events metrics");
        console.log(domElementId);
        // await parseUrlParams();
        // await getBrowserPlatformDetails();

        const raw = JSON.stringify({
            "applicationId": `${contextApi.applicationId}`,
            "fromUrl": `${window.location.pathname}`,
            "elements": timerEventsCache
            // "elements": [
            //         {
            //             "id":"btn-id-1",
            //             "htmlTag":"button",
            //             "actions": [
            //                 {
            //                     "name":"click",
            //                     "count": 150
            //                 },
            //                 {
            //                     "name":"click",
            //                     "count": 12
            //                 }
            //             ]
            //         },
            //                 {
            //             "id":"btn-id-XD",
            //             "htmlTag":"button",
            //             "actions": [
            //                 {
            //                     "name":"mouseover",
            //                     "count": 1
            //                 },
            //                 {
            //                     "name":"click",
            //                     "count": 12
            //                 }
            //             ]
            //         }
            //     ]
            });

            const resp = await fetch('http://localhost:9000/api/metrics', {
            method: 'POST',
            credentials: 'include', //'same-origin' => must use same origin for prod TODO
            headers: {
                'Content-Type': 'application/json'
            },
            body: raw
            });
            const data = await resp.json();
            console.log(data);

            timerEventsCache = [];

            return timerEventsCache;

    } catch ( e ) {

            timerEventsCache = [];
            return timerEventsCache;
    }
    
}


/**
 * Data related to the DOM ( intersection observer )
 */
const sendIntersectMetric = async ( contextApi:any ) => {
    console.log("Send intersect metrics");
}


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


    let timerEvents:any;
    let timerIntersect:any;
    let timerEventsCache : Array<IMetricEvent> = [];
    


    useEffect( () => {


        supportedEvents.forEach( (event) => {

            document.querySelector('#'+children.props.id)!.addEventListener(event, (e:any) => {
                timerEventsCache = updateCache(timerEventsCache, {
                    id: children.props.id,
                    htmlTag: children.props.htmlTag,
                    actions: [
                        {
                            name: event,
                            count: 1
                        }
                    ]
                });
                // debounce.
                // if value change, will trigger in 2s, but if another change is detected before, remove the current timer req and replace it
                clearTimeout(timerEvents);
                timerEvents = setTimeout( async () => timerEventsCache = await sendMetrics(contextApi, children.props.id, timerEventsCache), 2000);
            });

        });

        let observer = new IntersectionObserver((entries:any) => {
            
            if ( entries[0].isIntersecting ) {
                // setColor("bg bg-red-500");
                // console.log("Intercepted : #" + entries[0].target.id)

                timerEventsCache = updateCache(timerEventsCache, {
                    id: children.props.id,
                    htmlTag: children.props.htmlTag,
                    actions: [
                        {
                            name: "intersect",
                            count: 1
                        }
                    ]
                });

                clearTimeout(timerIntersect);
                timerIntersect = setTimeout( async () => timerEventsCache = await sendMetrics(contextApi, children.props.id, timerEventsCache), 2000);
            } else {
                // setColor("bg bg-blue-500");
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