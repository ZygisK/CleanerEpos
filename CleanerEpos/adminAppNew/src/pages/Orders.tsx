import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Input } from '@/components/ui/Input';
import { OrderModel, ProductModel, CreateTransactionModel } from '@/types/models';
import { getAllOrders, deleteOrder, saveOrder } from '@/services/orderService';
import { getAllProducts } from '@/services/productService';
import { transactionService } from '@/services/transactionService';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { Eye, RefreshCw, Trash2, Check, XCircle } from 'lucide-react';

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<OrderModel[]>([]);
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<OrderModel | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isVoidModalOpen, setIsVoidModalOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isVoiding, setIsVoiding] = useState<boolean>(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter((o) =>
      [
        o.id,
        String(o.tableNumber),
        o.status,
        o.notes ?? '',
        format(new Date(o.createdAt), 'yyyy-MM-dd HH:mm'),
      ]
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [orders, search]);

  const getStatusColor = (status: string) => {
    const lower = status.toLowerCase();
    if (lower === 'pending') return 'bg-yellow-100 text-yellow-800';
    if (lower === 'completed' || lower === 'approved') return 'bg-green-100 text-green-800';
    if (lower === 'voided' || lower === 'cancelled') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const openDelete = (order: OrderModel) => {
    setSelectedOrder(order);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedOrder) return;
    setIsDeleting(true);
    try {
      await deleteOrder(selectedOrder.id);
      toast.success('Order deleted');
      setIsDeleteModalOpen(false);
      setSelectedOrder(null);
      fetchOrders();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete order');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleProcessOrder = async () => {
    if (!selectedOrder) return;
    setIsProcessing(true);
    try {
      // Create transaction from order
      const txModel: CreateTransactionModel = {
        status: 'Completed',
        items: selectedOrder.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice
        }))
      };

      await transactionService.createTransaction(txModel);
      
      // Update order status to Completed
      const updatedOrder = { ...selectedOrder, status: 'Completed' };
      await saveOrder(updatedOrder);
      
      toast.success('Order processed and transaction created');
      setIsViewModalOpen(false);
      setSelectedOrder(null);
      fetchOrders();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to process order');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoidOrder = async () => {
    if (!selectedOrder) return;
    setIsVoiding(true);
    try {
      // Update order status to Voided
      const updatedOrder = { ...selectedOrder, status: 'Voided' };
      await saveOrder(updatedOrder);
      
      toast.success('Order voided');
      setIsVoidModalOpen(false);
      setIsViewModalOpen(false);
      setSelectedOrder(null);
      fetchOrders();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to void order');
    } finally {
      setIsVoiding(false);
    }
  };

  const openViewModal = (order: OrderModel) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-1">View and manage customer orders</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchOrders} variant="secondary">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-4 flex flex-col md:flex-row md:items-center gap-3">
          <Input
            placeholder="Search by id, table, status, note, date..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="p-4">
          <Table<OrderModel>
            data={filtered}
            isLoading={isLoading}
            emptyMessage="No orders found"
            keyExtractor={(o) => o.id}
            columns={[
              {
                key: 'createdAt',
                label: 'Created',
                render: (o) => (
                  <span>{format(new Date(o.createdAt), 'yyyy-MM-dd HH:mm')}</span>
                ),
              },
              {
                key: 'tableNumber',
                label: 'Table',
                render: (o) => <span>#{o.tableNumber}</span>,
              },
              {
                key: 'items',
                label: 'Items',
                render: (o) => <span>{o.items?.length ?? 0}</span>,
              },
              {
                key: 'totalAmount',
                label: 'Total',
                align: 'right',
                render: (o) => <span>€{o.totalAmount.toFixed(2)}</span>,
              },
              {
                key: 'status',
                label: 'Status',
                render: (o) => (
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(o.status)}`}
                  >
                    {o.status}
                  </span>
                ),
              },
              {
                key: 'actions',
                label: 'Actions',
                align: 'right',
                render: (o) => (
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openViewModal(o);
                      }}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      title="View Order"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {o.status.toLowerCase() !== 'completed' && o.status.toLowerCase() !== 'approved' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openViewModal(o);
                        }}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                        title="Process Order"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    {o.status.toLowerCase() === 'completed' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(o);
                          setIsVoidModalOpen(true);
                        }}
                        className="p-1 text-orange-600 hover:bg-orange-50 rounded"
                        title="Void Order"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openDelete(o);
                      }}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      title="Delete Order"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </Card>

      {/* View/Process Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedOrder(null);
        }}
        title={selectedOrder ? `Order #${selectedOrder.id.slice(0, 8)}` : ''}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Created</p>
                <p className="font-medium">{format(new Date(selectedOrder.createdAt), 'yyyy-MM-dd HH:mm')}</p>
              </div>
              <div>
                <p className="text-gray-500">Table Number</p>
                <p className="font-medium">#{selectedOrder.tableNumber}</p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                <p className={`font-medium inline-flex items-center rounded-full px-2 py-0.5 text-xs ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </p>
              </div>
              {selectedOrder.notes && (
                <div>
                  <p className="text-gray-500">Notes</p>
                  <p className="font-medium">{selectedOrder.notes}</p>
                </div>
              )}
            </div>

            <div>
              <h3 className="font-medium mb-2">Items</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Qty</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 text-sm">
                    {selectedOrder.items.map((it) => {
                      const product = products.find(p => p.id === it.productId);
                      return (
                        <tr key={it.id}>
                          <td className="px-4 py-2">{product?.name ?? it.productId}</td>
                          <td className="px-4 py-2 text-right">{it.quantity}</td>
                          <td className="px-4 py-2 text-right">€{it.unitPrice.toFixed(2)}</td>
                          <td className="px-4 py-2 text-right">€{it.totalPrice.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={3} className="px-4 py-2 text-right font-semibold">Total</td>
                      <td className="px-4 py-2 text-right font-semibold">€{selectedOrder.totalAmount.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedOrder(null);
                }}
              >
                Close
              </Button>
              {selectedOrder.status.toLowerCase() !== 'completed' && selectedOrder.status.toLowerCase() !== 'approved' && (
                <Button
                  variant="primary"
                  onClick={handleProcessOrder}
                  isLoading={isProcessing}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Process Order
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedOrder(null);
        }}
        onConfirm={handleDelete}
        title="Delete Order"
        message={
          selectedOrder ? (
            <div>
              <p>Are you sure you want to delete order <strong>#{selectedOrder.id.slice(0, 8)}</strong>?</p>
              <p className="text-red-600 mt-2">This action cannot be undone.</p>
            </div>
          ) : (
            'Delete this order?'
          )
        }
        confirmText="Delete Order"
        isLoading={isDeleting}
        variant="danger"
      />

      <ConfirmModal
        isOpen={isVoidModalOpen}
        onClose={() => {
          setIsVoidModalOpen(false);
          setSelectedOrder(null);
        }}
        onConfirm={handleVoidOrder}
        title="Void Order"
        message={
          selectedOrder ? (
            <div>
              <p>Are you sure you want to void order <strong>#{selectedOrder.id.slice(0, 8)}</strong>?</p>
              <p className="text-orange-600 mt-2">This will mark the order as voided and prevent further processing.</p>
            </div>
          ) : (
            'Void this order?'
          )
        }
        confirmText="Void Order"
        isLoading={isVoiding}
        variant="warning"
      />
    </div>
  );
};
