import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Input } from '@/components/ui/Input';
import { OrderModel, ProductModel } from '@/types/models';
import { getAllOrders, deleteOrder } from '@/services/orderService';
import { getAllProducts } from '@/services/productService';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { Eye, RefreshCw, Trash2 } from 'lucide-react';

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<OrderModel[]>([]);
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<OrderModel | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

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
                render: (o) => <span>£{o.totalAmount.toFixed(2)}</span>,
              },
              {
                key: 'status',
                label: 'Status',
                render: (o) => (
                  <span
                    className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-800"
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
                    <Button
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOrder(o);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDelete(o);
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </Card>

      {/* View Modal (simple) */}
      {selectedOrder && (
        <Card>
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Order #{selectedOrder.id.slice(0,8)}</h2>
              <Button variant="secondary" onClick={() => setSelectedOrder(null)}>Close</Button>
            </div>
            <div className="text-sm text-gray-600">
              <p>Created: {format(new Date(selectedOrder.createdAt), 'yyyy-MM-dd HH:mm')}</p>
              <p>Table: #{selectedOrder.tableNumber}</p>
              <p>Status: {selectedOrder.status}</p>
              {selectedOrder.notes && <p>Notes: {selectedOrder.notes}</p>}
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
                          <td className="px-4 py-2 text-right">£{it.unitPrice.toFixed(2)}</td>
                          <td className="px-4 py-2 text-right">£{it.totalPrice.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              {/* Future: processing actions (status updates, create transaction) */}
            </div>
          </div>
        </Card>
      )}

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Order"
        message={
          selectedOrder ? (
            <div>
              <p>Delete order <strong>#{selectedOrder.id.slice(0,8)}</strong>?</p>
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
    </div>
  );
};


