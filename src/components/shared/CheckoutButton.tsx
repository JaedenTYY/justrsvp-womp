"use client"

import { IEvent } from "../../../types/interface"
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import Checkout from './Checkout'

interface CheckoutButtonProps {
  event: IEvent;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ event }) => {
  const { user } = useUser();
  const userId = user?.publicMetadata.userId as string;
  const hasEventFinished = new Date(event.endDate) < new Date();

  return (
    <div className="flex items-center gap-3">
      {hasEventFinished ? (
        <p className="p-2 text-red-400">Sorry, tickets are no longer available.</p>
      ): (
        <>
          <SignedOut>
            <Button asChild className="button rounded-fullx" size="lg">
              <Link href="/sign-in">
                Get Tickets
              </Link>
            </Button>
          </SignedOut>

          <SignedIn>
            {userId && (
              <Checkout event={event} userId={parseInt(userId, 10)} />
            )}
          </SignedIn>
        </>
      )}
    </div>
  )
}

export default CheckoutButton