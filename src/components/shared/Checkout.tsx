"use client"

import React from 'react'
import { IEvent } from "../../../types/interface"

interface CheckoutProps {
  event: IEvent;
  userId: number;
}

const Checkout: React.FC<CheckoutProps> = ({ event, userId }) => {
  // Your checkout logic here
  return (
    <div>
      {/* Checkout component content */}
    </div>
  )
}

export default Checkout