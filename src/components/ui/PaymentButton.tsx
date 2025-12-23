import type {MouseEvent} from 'react'
import type {ApiError} from '../../api/config.ts'
import Button from './Button'
import {usePaymentLink} from '../../hooks/usePayments.ts'

type BaseButtonProps = React.ComponentProps<typeof Button>

interface PaymentButtonProps extends Omit<BaseButtonProps, 'onClick'> {
  gameId: string
  onPaymentStart?: () => void
  onPaymentCreated?: (paymentUrl: string) => void
  onPaymentError?: (error: ApiError) => void
}

function PaymentButton({
  gameId,
  children = 'Pay now',
  disabled,
  onPaymentStart,
  onPaymentCreated,
  onPaymentError,
  type = 'button',
  ...buttonProps
}: PaymentButtonProps) {
  const { createPaymentLink, loading } = usePaymentLink()

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    if (disabled || loading) return

    onPaymentStart?.()

    createPaymentLink(gameId, {
      onSuccess: ({ paymentUrl }) => {
        onPaymentCreated?.(paymentUrl)
        window.location.assign(paymentUrl)
      },
      onError: (error) => {
        onPaymentError?.(error)
        console.error('Unable to generate payment link', error)
      },
    })
  }

  return (
    <Button
      {...buttonProps}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading}
      onClick={handleClick}
    >
      {loading ? 'Redirecting...' : children}
    </Button>
  )
}

export default PaymentButton
