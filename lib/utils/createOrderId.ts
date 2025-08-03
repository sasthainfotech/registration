export async function createOrderId(
    amount: number,
    currency: string
) {
    try {
        const response = await fetch(
            '/api/razorpay/order',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: amount * 100, // Convert to paise
                    currency: currency || 'INR',
                }),
            }
        );

        if (!response.ok) {
            throw new Error('Failed to create order');
        }

        const data = await response.json();
        console.log('Order Response:', data);
        return data.orderId;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to create order');
    }
}
