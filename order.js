document.addEventListener('DOMContentLoaded', () => {
    const placeOrderButton = document.getElementById('placeOrder');
    const orderStatus = document.getElementById('orderStatus');

    placeOrderButton.addEventListener('click', () => {
        const foodItem = document.getElementById('foodItem').value;
        const quantity = document.getElementById('quantity').value;

        if (foodItem && quantity) {
            const orderNumber = new Date().getTime(); // Simple unique order number
            const order = {
                orderNumber: orderNumber,
                foodItem: foodItem,
                quantity: quantity,
                timestamp: new Date().toLocaleString()
            };

            // Store the order in local storage
            let orders = JSON.parse(localStorage.getItem('orders')) || [];
            orders.push(order);
            localStorage.setItem('orders', JSON.stringify(orders));

            orderStatus.textContent = `Order placed successfully! Your order number is ${orderNumber}.`;
        } else {
            orderStatus.textContent = 'Please select a food item and quantity.';
        }
    });
});
