import { createFileRoute } from "@tanstack/react-router";
import Landing from "@/components/Landing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MotoLucro — Lucro real por km para motoboys" },
      {
        name: "description",
        content:
          "Controle financeiro para motoboys: turnos, abastecimento, ganhos por app e lucro real por km. App mobile + painel web.",
      },
      { property: "og:title", content: "MotoLucro — Lucro real por km para motoboys" },
      {
        property: "og:description",
        content:
          "Saiba quanto você realmente ganhou: combustível, desgaste e custos fixos descontados automaticamente.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});
