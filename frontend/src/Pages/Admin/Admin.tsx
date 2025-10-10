import { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaTicketAlt, FaGamepad } from "react-icons/fa";
import SidebarButton from "./SidebarButton";
import UsersTab from "./UsersTab";
import TicketsTab from "./TicketsTab";
import CheatsTab from "./CheatsTab";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<"users" | "tickets" | "cheats">("users");
  const [users, setUsers] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [cheats, setCheats] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const pw = prompt("Admin şifresini gir:");
    if (pw) {
      setPassword(pw);
      authenticate(pw);
    }
  }, []);

  const authenticate = async (pw: string) => {
    try {
      await axios.post("http://localhost:5000/api/admin/user/all", { password: pw });
      setAuthenticated(true);
      fetchAll(pw);
    } catch {
      alert("❌ Hatalı şifre!");
    }
  };

  const fetchAll = (pw: string) => {
    fetchUsers(pw);
    fetchTickets(pw);
    fetchCheats(pw);
  };

  const fetchUsers = async (pw: string) => {
    setLoading(true);
    const res = await axios.post("http://localhost:5000/api/admin/user/all", { password: pw });
    setUsers(res.data);
    setLoading(false);
  };

  const fetchTickets = async (pw: string) => {
    setLoading(true);
    const res = await axios.post("http://localhost:5000/api/admin/tickets", { password: pw });
    setTickets(res.data);
    setLoading(false);
  };

  const fetchCheats = async (pw: string) => {
    setLoading(true);
    const res = await axios.post("http://localhost:5000/api/admin/cheats", { password: pw });
    setCheats(res.data);
    setLoading(false);
  };

  const banUser = async (id: string) => {
    await axios.post(`http://localhost:5000/api/admin/user/ban/${id}`, { password });
    fetchUsers(password);
  };

  const unbanUser = async (id: string) => {
    await axios.post(`http://localhost:5000/api/admin/user/unban/${id}`, { password });
    fetchUsers(password);
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Kullanıcıyı silmek istediğine emin misin?")) return;
    await axios.post(`http://localhost:5000/api/admin/user/delete/${id}`, { password });
    fetchUsers(password);
  };

  const closeTicket = async (id: string) => {
    await axios.post(`http://localhost:5000/api/admin/ticket/close/${id}`, { password });
    fetchTickets(password);
  };

  const reopenTicket = async (id: string) => {
    await axios.post(`http://localhost:5000/api/admin/ticket/reopen/${id}`, { password });
    fetchTickets(password);
  };

  if (!authenticated) return null;

  return (
    <div className="flex min-h-screen bg-[#0b0b0f] text-gray-200">
      <div className="w-64 bg-[#121218] border-r border-gray-800 p-5 flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-6 text-purple-400">Admin Panel</h2>
        <SidebarButton label="Users" icon={<FaUser />} active={activeTab === "users"} onClick={() => setActiveTab("users")} />
        <SidebarButton label="Tickets" icon={<FaTicketAlt />} active={activeTab === "tickets"} onClick={() => setActiveTab("tickets")} />
        <SidebarButton label="Cheats" icon={<FaGamepad />} active={activeTab === "cheats"} onClick={() => setActiveTab("cheats")} />
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        {loading ? (
          <div className="text-center text-gray-500 animate-pulse">Loading...</div>
        ) : (
          <>
            {activeTab === "users" && (
              <UsersTab users={users} banUser={banUser} unbanUser={unbanUser} deleteUser={deleteUser} />
            )}
            {activeTab === "tickets" && (
              <TicketsTab tickets={tickets} closeTicket={closeTicket} reopenTicket={reopenTicket} />
            )}
            {activeTab === "cheats" && <CheatsTab cheats={cheats} />}
          </>
        )}
      </div>
    </div>
  );
}