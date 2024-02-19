"use client";

import Loading from '@/components/Loading';
import OrdersCard from '@/components/OrderCard'
import { getOrders, getPastOrders } from '@/lib/features/orders/orderSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useEffect, useState } from 'react';
import { parseISO, isWithinInterval, subDays, subHours } from 'date-fns';
import type { Order } from '@/lib/features/orders/orderSlice';
export default function Orders() {
  const dispatch = useAppDispatch();
  const data = useAppSelector(state => state.orderReducers.pastOrders)
  const loading = useAppSelector(state => state.orderReducers.loading)
  
  useEffect(() => {
    dispatch(getPastOrders())
  }, [dispatch])
  const [orders, setOrders] = useState<Order[]>(data);
  const [range, setRange] = useState('all')
  useEffect(() => {
    let currentDate = new Date();
    let sevenDaysAgo = subDays(currentDate, 7);
    let twentyFourHoursAgo = subHours(currentDate, 24);
    const filtered = data!.filter((o) => {
      const date = o?.orderTime || new Date();
      let c1 = true;
      if (range === 'today') {
        c1 = isWithinInterval(date, { start: twentyFourHoursAgo, end: currentDate });
      } else if (range === 'week') {

        c1 = isWithinInterval(date, { start: sevenDaysAgo, end: currentDate });
      }


      return c1;
    })
    setOrders(filtered)
  }, [setOrders, data, range])
  return (
    <div className='flex flex-col mt-6 mx-4 gap-5 justify-center items-center'>
      <div className='w-full justify-end flex gap-4 items-center'>
        <label htmlFor="time-range" className='text-white font-bold text-md'></label>

        <select name="time-range" id="time-range" className='rounded-md min-w-max px-2 py-1' value={range} onChange={e => {
          setRange(e.target.value)
        }}>
          <option value="all">All</option>
          <option value="today">Today</option>
          {/* <option value="yesterday">Yesterday</option> */}
          <option value="week">Past 7 days</option>
        </select>

      </div>

      {
       (!loading)  ? <>
       {
        orders.length > 0 ? (orders.map((v) => <OrdersCard key={v?.orderId} details={v} />)) : <div>No data</div>
       }
       </> : <div className='w-full h-screen'><Loading /></div>
      }


    </div>

  )
}