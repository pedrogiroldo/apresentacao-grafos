"use client";

import { useEffect, useState, useRef } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import type Cytoscape from "cytoscape";

interface Node {
  id: string;
  label: string;
}

interface Edge {
  source: string;
  target: string;
}

interface User {
  id: number;
  name: string;
}

export default function GraphPage() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [userName, setUserName] = useState("");
  const [followerId, setFollowerId] = useState("");
  const [followingId, setFollowingId] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const cyRef = useRef<Cytoscape.Core | null>(null);

  // Carregar grafo e usuários
  const loadGraph = async () => {
    try {
      const response = await fetch("/api/graph");
      if (!response.ok) {
        console.error("Erro ao carregar grafo:", response.statusText);
        setNodes([]);
        setEdges([]);
        return;
      }
      const data = await response.json();
      // Garantir que nodes e edges são arrays
      setNodes(Array.isArray(data.nodes) ? data.nodes : []);
      setEdges(Array.isArray(data.edges) ? data.edges : []);
    } catch (error) {
      console.error("Erro ao carregar grafo:", error);
      setNodes([]);
      setEdges([]);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch("/api/graph");
      if (!response.ok) {
        console.error("Erro ao carregar usuários:", response.statusText);
        setUsers([]);
        return;
      }
      const data = await response.json();
      // Extrair usuários dos nodes
      if (Array.isArray(data.nodes)) {
        const usersList: User[] = data.nodes.map((node: Node) => ({
          id: parseInt(node.id.replace("user-", "")),
          name: node.label,
        }));
        setUsers(usersList);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      setUsers([]);
    }
  };

  useEffect(() => {
    loadGraph();
    loadUsers();
  }, []);

  // Configuração do Cytoscape
  const cyStylesheet = [
    {
      selector: "node",
      style: {
        "background-color": "#5b5b5b",
        label: "data(label)",
        color: "white",
        width: 40,
        height: 40,
        "text-valign": "center",
        "text-halign": "center",
        "font-size": "12px",
        "font-weight": "bold",
      },
    },
    {
      selector: "edge",
      style: {
        "line-color": "#777",
        width: 2,
        "target-arrow-color": "#777",
        "target-arrow-shape": "triangle",
        "curve-style": "bezier",
      },
    },
  ];

  const cyLayout = {
    name: "cose",
    animate: true,
    animationDuration: 1000,
    fit: true,
    padding: 30,
  };

  // Criar usuário
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;

    setLoading(true);
    setSuccessMessage("");
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: userName.trim() }),
      });

      if (response.ok) {
        setUserName("");
        setSuccessMessage("Usuário criado com sucesso!");
        await loadGraph();
        await loadUsers();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        const error = await response.json();
        setSuccessMessage(`Erro: ${error.error || "Erro ao criar usuário"}`);
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      setSuccessMessage("Erro ao criar usuário");
      setTimeout(() => setSuccessMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Criar follow
  const handleCreateFollow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followerId || !followingId) return;

    setLoading(true);
    setSuccessMessage("");
    try {
      const response = await fetch("/api/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          followerId: parseInt(followerId),
          followingId: parseInt(followingId),
        }),
      });

      if (response.ok) {
        setFollowerId("");
        setFollowingId("");
        setSuccessMessage("Follow criado com sucesso!");
        await loadGraph();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        const error = await response.json();
        setSuccessMessage(`Erro: ${error.error || "Erro ao criar follow"}`);
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      console.error("Erro ao criar follow:", error);
      setSuccessMessage("Erro ao criar follow");
      setTimeout(() => setSuccessMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Preparar dados para Cytoscape
  const safeNodes = Array.isArray(nodes) ? nodes : [];
  const safeEdges = Array.isArray(edges) ? edges : [];
  
  const cyElements = [
    ...safeNodes.map((node) => ({
      data: {
        id: node.id,
        label: node.label,
      },
    })),
    ...safeEdges.map((edge, index) => ({
      data: {
        id: `edge-${index}`,
        source: edge.source,
        target: edge.target,
      },
    })),
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-12 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Rede Social
            </h1>
          </div>
          <p className="text-zinc-400 ml-4">
            Visualização interativa do grafo de relacionamentos
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-zinc-400 text-sm mb-1">Usuários</div>
            <div className="text-2xl font-bold text-blue-400">
              {Array.isArray(nodes) ? nodes.length : 0}
            </div>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-zinc-400 text-sm mb-1">Conexões</div>
            <div className="text-2xl font-bold text-purple-400">
              {Array.isArray(edges) ? edges.length : 0}
            </div>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-zinc-400 text-sm mb-1">Status</div>
            <div className="text-2xl font-bold text-green-400">Ativo</div>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              successMessage.includes("Erro")
                ? "bg-red-950/50 border-red-800 text-red-200"
                : "bg-green-950/50 border-green-800 text-green-200"
            } transition-all duration-300`}
          >
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Área do grafo */}
          <div className="lg:col-span-2">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 backdrop-blur-sm shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-zinc-100">
                  Grafo de Relacionamentos
                </h2>
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-zinc-400">Live</span>
                </div>
              </div>
              <div className="bg-zinc-950 rounded-lg border border-zinc-800 h-[600px] overflow-hidden shadow-inner">
                <CytoscapeComponent
                  elements={cyElements}
                  style={{ width: "100%", height: "100%" }}
                  stylesheet={cyStylesheet}
                  layout={cyLayout}
                  cy={(cy: Cytoscape.Core) => {
                    cyRef.current = cy;
                  }}
                />
              </div>
            </div>
          </div>

          {/* Sidebar com formulários */}
          <div className="space-y-6">
            {/* Formulário de criar usuário */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 backdrop-blur-sm shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-zinc-100">
                  Novo Usuário
                </h2>
              </div>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Digite o nome do usuário"
                    disabled={loading}
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !userName.trim()}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-blue-700 shadow-lg hover:shadow-blue-500/50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Criando...
                    </span>
                  ) : (
                    "Criar Usuário"
                  )}
                </button>
              </form>
            </div>

            {/* Formulário de criar follow */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 backdrop-blur-sm shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-zinc-100">
                  Nova Conexão
                </h2>
              </div>
              <form onSubmit={handleCreateFollow} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Quem segue
                  </label>
                  <select
                    value={followerId}
                    onChange={(e) => setFollowerId(e.target.value)}
                    disabled={loading || users.length === 0}
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Selecione um usuário</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-center py-2">
                  <div className="w-full border-t border-zinc-700"></div>
                  <div className="px-4">
                    <svg
                      className="w-5 h-5 text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                  <div className="w-full border-t border-zinc-700"></div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Quem é seguido
                  </label>
                  <select
                    value={followingId}
                    onChange={(e) => setFollowingId(e.target.value)}
                    disabled={loading || users.length === 0}
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Selecione um usuário</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>

                {followerId === followingId && followerId !== "" && (
                  <div className="p-3 bg-yellow-950/50 border border-yellow-800 rounded-lg text-yellow-200 text-sm">
                    ⚠️ Não é possível seguir a si mesmo
                  </div>
                )}

                <button
                  type="submit"
                  disabled={
                    loading ||
                    !followerId ||
                    !followingId ||
                    followerId === followingId
                  }
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-purple-600 disabled:hover:to-purple-700 shadow-lg hover:shadow-purple-500/50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Criando...
                    </span>
                  ) : (
                    "Criar Conexão"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
