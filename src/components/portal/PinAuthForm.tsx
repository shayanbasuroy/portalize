'use client'

import React, { useActionState, useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PinInput } from './PinInput'
import { verifyPinAction, PortalActionState } from '@/app/actions/portal'
import { AlertCircle, Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface PinAuthFormProps {
  slug: string
  projectTitle: string
  freelancerBrand?: {
    logo_url?: string | null
    brand_color?: string | null
    business_name?: string | null
  } | null
}

const initialState: PortalActionState = {}

export function PinAuthForm({ slug, projectTitle, freelancerBrand }: PinAuthFormProps) {
  const [pin, setPin] = useState('')
  const [state, formAction, isPending] = useActionState(verifyPinAction, initialState)

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader className="text-center space-y-4">
        {freelancerBrand?.logo_url && (
          <div className="flex justify-center">
            <img
              src={freelancerBrand.logo_url}
              alt={freelancerBrand.business_name || 'Freelancer'}
              className="h-16 w-16 rounded-xl bg-white object-contain ring-1 ring-zinc-100"
            />
          </div>
        )}
        <div>
          <CardTitle className="text-2xl font-bold">{projectTitle}</CardTitle>
          <CardDescription className="text-base mt-2">
            Enter your 4-digit access PIN to view this project
          </CardDescription>
        </div>
      </CardHeader>
      
      <form action={formAction}>
        <CardContent className="space-y-6">
          <input type="hidden" name="slug" value={slug} />
          <input type="hidden" name="pin" value={pin} />
          
          <div className="flex justify-center py-4">
            <PinInput 
              length={4} 
              value={pin} 
              onChange={setPin} 
              disabled={isPending}
            />
          </div>

          {state?.message && !state.success && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full"
            size="lg"
            disabled={pin.length < 4 || isPending}
            style={{ 
              backgroundColor: freelancerBrand?.brand_color || undefined,
              borderColor: freelancerBrand?.brand_color || undefined
            }}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Access Portal'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
