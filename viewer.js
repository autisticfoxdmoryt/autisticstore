document.addEventListener('DOMContentLoaded', () => {
    const orderList = document.getElementById('orderList');
    const orders = JSON.parse(localStorage.getItem('orders')) || [];

    if (orders.length === 0) {
        orderList.innerHTML = '<li>No orders placed yet.</li>';
    } else {
        orders.forEach(order => {
            const listItem = document.createElement('li');
            listItem.textContent = `Order Number: ${order.orderNumber}, Item: ${order.foodItem}, Quantity: ${order.quantity}, Time: ${order.timestamp}`;
            orderList.appendChild(listItem);
        });
    }
});
