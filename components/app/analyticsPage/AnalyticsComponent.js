"use client"
import React, { useEffect, useState } from "react";
import { ClicksChart } from "./ClicksChart";
import { useAnalyticsLogic } from "./useAnalyticsLogic";
import { BrowsersChart } from "./BrowsersChart";
import { OSChart } from "./OsChart";
import { CountriesChart, GeoMapChart } from "./CountriesChart";
import { ReferrerChart } from "./ReferrerChart";




const AnalyticsComponent = () => {

  const {data , isLoading , clicksAnalytics , urlAnalytics} = useAnalyticsLogic()
  const [formedClicks , setFormedClicks ] = useState([])
  const [totalClicks , setTotalClicks] = useState()
  const [uniqueClicks , setUniqueClicks] = useState()
  

  function transformClicksForChart(details) {
    console.log(details)
    const dailyAggregates = {};
  
    details && details.forEach(click => {
      const date = new Date(click.timestamp);
      // Format the date as "MM/DD" for the chart X-axis
      const dateKey = `${date.getDate()}-${date.getMonth() + 1}`;
      const ip = click.ip_address;
  
      if (!dailyAggregates[dateKey]) {
        dailyAggregates[dateKey] = { total: 0, ips: new Set() };
      }
  
      dailyAggregates[dateKey].total++;
      dailyAggregates[dateKey].ips.add(ip);
    });
  
    
    // Convert the aggregated map into the final array format
    return Object.keys(dailyAggregates)
      .sort() // Sort by date
      .map(dateKey => ({
        day: dateKey,
        clicks: dailyAggregates[dateKey].total,
        unique: dailyAggregates[dateKey].ips.size,
      }));
  }

  useEffect(() => {
    setFormedClicks(transformClicksForChart(clicksAnalytics))
    console.log(clicksAnalytics.countries)
   
  }, [isLoading])

  useEffect(() => {
    setTotalClicks(formedClicks.reduce((acc , val) => acc + val.clicks , 0))
    setUniqueClicks(formedClicks.reduce((acc , val) => acc + val.unique , 0))
  },[formedClicks])

  return (
    <div>
      <div class="p-6 md:p-8 bg-gray-900 min-h-screen text-white">
        <header class="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center border-b  pb-4">
          <div>
            <h2 class="text-3xl font-bold">Analytics</h2>
            <p class="text-gray-400">
              Monitor your link performance and user engagement metrics.
            </p>
          </div>

          <div class="flex items-center space-x-4 mt-4 md:mt-0">
            <button class="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium rounded-lg bg-background hover:bg-gray-700 transition duration-150">
              <span>Filters</span>
              <span class="text-xs">🔽</span>
            </button>

            <div class="flex items-center space-x-3 text-sm text-gray-300">
              <span class="px-3 py-1.5 rounded-lg bg-background cursor-pointer hover:bg-gray-700 transition duration-150">
                Last 7 days 🔽
              </span>
              <span class="text-xl opacity-70 cursor-pointer hover:opacity-100">
                ⚙️
              </span>
              <span class="text-xl opacity-70 cursor-pointer hover:opacity-100">
                ⬇️
              </span>
            </div>

            <div class="hidden md:block">
              <div class="flex space-x-4 ml-8">
                <div class="text-center">
                  <p class="text-xl font-bold">0</p>
                  <p class="text-xs text-gray-400">Total Clicks</p>
                </div>
                <div class="text-center">
                  <p class="text-xl font-bold">0</p>
                  <p class="text-xs text-gray-400">Unique Visitors</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <section class="lg:col-span-3 bg-background rounded-xl shadow-lg p-5">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold">Clicks Over Time</h3>
              <span class="text-gray-400 cursor-pointer">❌</span>
            </div>
            <div class="h-80   border border-gray-700 rounded-lg">
              {!formedClicks ? <p class="text-gray-500 italic flex justify-center h-full items-center">No Data Available for Clicks Over Time</p>
             : <ClicksChart data={formedClicks}/>}
            </div>
            {/* <div class="flex mt-3 space-x-4 text-sm text-gray-400">
              <span class="flex items-center">
                <span class="w-2 h-2 rounded-full bg-indigo-400 mr-2"></span>
                Total Clicks
              </span>
              <span class="flex items-center">
                <span class="w-2 h-2 rounded-full bg-pink-400 mr-2"></span>
                Unique Clicks
              </span>
            </div> */}
          </section>

          <aside class="lg:col-span-1 gap-4 flex flex-col justify-between">
            <div class="bg-background rounded-xl p-5 text-center h-full flex flex-col justify-center">
              <p class="text-3xl font-bold text-primary ">{totalClicks && totalClicks}</p>
              <p class="text-muted-foreground text-sm">Total Clicks</p>
            </div>
            <div class="bg-background rounded-xl p-5 text-center h-full flex flex-col justify-center">
              <p class="text-3xl font-bold text-primary">{uniqueClicks && uniqueClicks}</p>
              <p class="text-muted-foreground text-sm">Unique Visitors</p>
            </div>
            <div class="bg-background rounded-xl p-5 text-center h-full flex flex-col justify-center">
              <p class="text-3xl font-bold text-primary">{uniqueClicks && totalClicks && uniqueClicks/totalClicks*100}%</p>
              <p class="text-muted-foreground text-sm">Unique Rate</p>
            </div>
            {/* <div class="bg-background rounded-xl p-5 text-center">
              <p class="text-3xl font-bold text-primary">0 ms</p>
              <p class="text-muted-foreground text-sm">Avg. Response Time</p>
            </div> */}
          </aside>
        </div>

        <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         

          <div class="bg-background rounded-xl shadow-lg p-5 flex flex-col justify-center items-center h-64">
            <div class="w-full flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold">Referrers</h3>
              <span class="text-gray-400 cursor-pointer">❌</span>
            </div>
           {!urlAnalytics.referrers ? <div class="text-center flex-grow flex flex-col justify-center items-center">
              <span class="text-4xl mb-2 text-gray-500">↩️</span>
              <p class="text-gray-400 font-medium">No Referrer Data</p>
              <p class="text-xs text-gray-500 mt-1">
                Referrer info will display once people click your links.
              </p>
            </div>
            :
            <ReferrerChart data={urlAnalytics.referrers} />  
          }
          </div>

          <div class="bg-background rounded-xl shadow-lg p-5 flex flex-col justify-center items-center h-64">
            <div class="w-full flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold">Browsers</h3>
              <span class="text-gray-400 cursor-pointer">❌</span>
            </div>
            <div class="text-center flex-grow flex flex-col justify-center items-center">
              {!urlAnalytics.browsers.length ? <><span class="text-4xl mb-2 text-gray-500">🌐</span>
              <p class="text-gray-400 font-medium">No Browser Data</p>
              <p class="text-xs text-gray-500 mt-1">
                Browser analysis will show which users click your links
              </p></>
              :
              <BrowsersChart data={urlAnalytics.browsers}/>}
            </div>
          </div>

          <div class="bg-background rounded-xl shadow-lg p-5 flex flex-col justify-center items-center h-64">
            <div class="w-full flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold">Platforms</h3>
              <span class="text-gray-400 cursor-pointer">❌</span>
            </div>
            <div class="text-center flex-grow flex flex-col justify-center items-center">
             {!urlAnalytics.os.length ? <> <span class="text-4xl mb-2 text-gray-500">💻</span>
              <p class="text-gray-400 font-medium">No Platform Data</p>
              <p class="text-xs text-gray-500 mt-1">
                Operating system stats will populate as users engage with your
                links
              </p> </>
              :<OSChart data={urlAnalytics['os']}/>}
            </div>
          </div>

          <div class="bg-background rounded-xl shadow-lg p-5 flex flex-col justify-center items-center h-64">
            <div class="w-full flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold">Countries</h3>
              <span class="text-gray-400 cursor-pointer">❌</span>
            </div>
            {/* <div class="text-center flex-grow flex flex-col justify-center items-center">
              <span class="text-4xl mb-2 text-gray-500">🌍</span>
              <p class="text-gray-400 font-medium">No Country Data</p>
              <p class="text-xs text-gray-500 mt-1">
                Country data will display once visitors engage with your links
              </p>
            </div> */}
            {<CountriesChart data={urlAnalytics.countries} />}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AnalyticsComponent;
