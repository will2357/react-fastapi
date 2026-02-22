import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
// TODO: Replace with your own feature
// This is a placeholder UI - remove or replace with your feature
import { fetchItems, createItem, updateItem, deleteItem, type Item } from "../api/items";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { LogOut, User, Loader2, Pencil, Trash2 } from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await fetchItems();
      setItems(data);
    } catch (error) {
      console.error("Failed to load items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const newItem = await createItem({
        name: newItemName,
        price: parseFloat(newItemPrice),
      });
      setItems([...items, newItem]);
      setNewItemName("");
      setNewItemPrice("");
    } catch (error) {
      console.error("Failed to create item:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const startEdit = (item: Item) => {
    setEditingId(item.item_id);
    setEditName(item.name);
    setEditPrice(item.price.toString());
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditPrice("");
  };

  const handleUpdateItem = async (itemId: number) => {
    try {
      const updated = await updateItem(itemId, {
        name: editName,
        price: parseFloat(editPrice),
      });
      setItems(items.map((i) => (i.item_id === itemId ? updated : i)));
      cancelEdit();
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    try {
      await deleteItem(itemId);
      setItems(items.filter((i) => i.item_id !== itemId));
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-secondary">
      <header className="border-b bg-background">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg">Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{user?.username}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6 px-4 space-y-6">
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Welcome, {user?.username}!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You are now logged in and can access protected content.
            </p>
          </CardContent>
        </Card>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleCreateItem} className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="itemName">Name</Label>
                <Input
                  id="itemName"
                  type="text"
                  placeholder="Item name"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  required
                />
              </div>
              <div className="w-24">
                <Label htmlFor="itemPrice">Price</Label>
                <Input
                  id="itemPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Item"}
              </Button>
            </form>

            {isLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : items.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No items yet</p>
            ) : (
              <ul className="divide-y">
                {items.map((item) => (
                  <li key={item.item_id} className="py-3">
                    {editingId === item.item_id ? (
                      <div className="flex gap-2 items-end">
                        <div className="flex-1">
                          <Label htmlFor={`edit-name-${item.item_id}`} className="sr-only">
                            Name
                          </Label>
                          <Input
                            id={`edit-name-${item.item_id}`}
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                          />
                        </div>
                        <div className="w-24">
                          <Label htmlFor={`edit-price-${item.item_id}`} className="sr-only">
                            Price
                          </Label>
                          <Input
                            id={`edit-price-${item.item_id}`}
                            type="number"
                            step="0.01"
                            min="0"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                          />
                        </div>
                        <Button size="sm" onClick={() => handleUpdateItem(item.item_id)}>
                          Save
                        </Button>
                        <Button size="sm" variant="ghost" onClick={cancelEdit}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <span className="ml-3 text-muted-foreground">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEdit(item)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteItem(item.item_id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default Dashboard;
