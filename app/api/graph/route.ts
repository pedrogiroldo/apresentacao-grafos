import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Buscar todos os usuários com suas relações de follow
    const users = await prisma.user.findMany({
      include: {
        following: true,
      },
    });

    // Montar nodes
    const nodes = users.map((user) => ({
      id: `user-${user.id}`,
      label: user.name,
    }));

    // Montar edges
    const edges: Array<{ source: string; target: string }> = [];
    users.forEach((user) => {
      user.following.forEach((followed) => {
        edges.push({
          source: `user-${user.id}`,
          target: `user-${followed.id}`,
        });
      });
    });

    return NextResponse.json({ nodes, edges });
  } catch (error) {
    console.error("Erro ao buscar grafo:", error);
    // Sempre retornar nodes e edges como arrays, mesmo em caso de erro
    return NextResponse.json(
      { nodes: [], edges: [], error: "Erro ao buscar grafo" },
      { status: 500 }
    );
  }
}
