import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { fetchItems, createItem, type Item } from "../api/items";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { LogOut, User, Loader2 } from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");

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
                  <li key={item.item_id} className="py-3 flex justify-between items-center">
                    <span>{item.name}</span>
                    <span className="text-muted-foreground">${item.price.toFixed(2)}</span>
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
