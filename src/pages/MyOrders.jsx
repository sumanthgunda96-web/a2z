import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Calendar, CreditCard, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';

const MyOrders = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { getUserOrders } = useOrders();

    if (!currentUser) {
        navigate('/login');
        return null;
    }

    const orders = getUserOrders(currentUser.id);

    if (orders.length === 0) {
        return (
            <div className="min-h-screen bg-cream py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <div className="max-w-md w-full text-center">
                    <Package className="mx-auto h-16 w-16 text-gray-400" />
                    <h2 className="mt-4 text-2xl font-bold text-primary font-serif">No orders yet</h2>
                    <p className="mt-2 text-sm text-slate-light">
                        Start shopping to see your orders here!
                    </p>
                    <div className="mt-6">
                        <Link to="/products" className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-xl text-white bg-primary hover:bg-primary-dark transition-all">
                            Browse Products
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-primary font-serif mb-8">My Orders</h1>
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                <div className="flex flex-wrap justify-between items-center gap-4">
                                    <div>
                                        <p className="text-sm text-slate-light">Order ID</p>
                                        <p className="font-bold text-primary font-mono">{order.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-light">Date</p>
                                        <p className="font-medium text-primary flex items-center">
                                            <Calendar className="h-4 w-4 mr-1" />
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-light">Total</p>
                                        <p className="font-bold text-secondary text-lg">₹{order.total.toLocaleString('en-IN')}</p>
                                    </div>
                                    <div>
                                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                        'bg-gray-100 text-gray-800'
                                            }`}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4 mb-4">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4">
                                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                                            <div className="flex-1">
                                                <h3 className="font-bold text-primary">{item.name}</h3>
                                                <p className="text-sm text-slate-light">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-bold text-secondary">{item.price}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                                    <div>
                                        <p className="text-sm font-medium text-primary flex items-center mb-2">
                                            <MapPin className="h-4 w-4 mr-1" />
                                            Shipping Address
                                        </p>
                                        <p className="text-sm text-slate-light">
                                            {order.shippingAddress.fullName}<br />
                                            {order.shippingAddress.address}<br />
                                            {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-primary flex items-center mb-2">
                                            <CreditCard className="h-4 w-4 mr-1" />
                                            Payment Method
                                        </p>
                                        <p className="text-sm text-slate-light capitalize">
                                            {order.paymentMethod === 'cod' && 'Cash on Delivery'}
                                            {order.paymentMethod === 'online' && 'Online Payment'}
                                            {order.paymentMethod === 'whatsapp' && 'WhatsApp Order'}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-200 flex gap-3">
                                    <Link to={`/order-tracking/${order.id}`} className="inline-block px-6 py-2 bg-secondary text-white rounded-xl hover:bg-secondary-dark transition-all font-medium">
                                        Track Order
                                    </Link>
                                    <Link to={`/order-confirmation/${order.id}`} className="inline-block px-6 py-2 bg-white border-2 border-primary text-primary rounded-xl hover:bg-gray-50 transition-all font-medium">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyOrders;
