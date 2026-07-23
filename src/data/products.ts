import { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'caixa-milk-luxo',
    title: 'Caixa Milk de Luxo com Laço de Cetim',
    category: 'festas',
    subCategory: 'caixinhas',
    description: 'Caixa modelo Milk confeccionada em papel offset 180g de alta gramatura, com laço duplo de fita de cetim, aplique 3D em camadas e detalhes laminados dourados.',
    image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800',
    badge: 'Mais Pedido',
    popular: true,
    suggestedQuantities: [10, 20, 30, 50],
    customizationOptions: ['Nome do Aniversariante', 'Idade', 'Cor do Laço', 'Tema Personalizado']
  },
  {
    id: 'topo-bolo-shaker',
    title: 'Topo de Bolo Shaker Interativo 3D',
    category: 'papelaria',
    subCategory: 'topos_bolo',
    description: 'Topo de bolo personalizado com efeito Shaker (visor transparente com lantejoulas, glitter e miçangas que se mexem), camadas de papel lamicote e acrílico.',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&q=80&w=800',
    badge: 'Destaque IA',
    popular: true,
    suggestedQuantities: [1, 2, 3],
    customizationOptions: ['Nome', 'Idade', 'Tema', 'Opção de luz LED interna']
  },
  {
    id: 'caixa-piramide-cone',
    title: 'Caixa Pirâmide (Cone) Recorte Especial',
    category: 'festas',
    subCategory: 'caixinhas',
    description: 'Caixa modelo pirâmide ideal para compor a mesa principal da festa. Recorte eletrônico de precisão, aplique 3D na frente e pedraria/pompom no topo.',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800',
    popular: true,
    suggestedQuantities: [10, 20, 30, 40],
    customizationOptions: ['Nome', 'Idade', 'Tema', 'Estilo das pedrarias']
  },
  {
    id: 'tubete-3d-decorado',
    title: 'Tubetes com Capa de Cetim e Aplique 3D',
    category: 'papelaria',
    subCategory: 'tubetes',
    description: 'Tubete acrílico de 13cm personalizado com saia/capa em fita de cetim ou papel rendado, aplique em relevo do personagem e passamanaria no acabamento.',
    image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=800',
    badge: 'Super Fofo',
    suggestedQuantities: [10, 15, 20, 30],
    customizationOptions: ['Nome', 'Idade', 'Tema', 'Cor do Tubete (Tampa)']
  },
  {
    id: 'kit-festa-sprint',
    title: 'Kit Pegue e Monte Mimos Essenciais',
    category: 'festas',
    subCategory: 'kits_festa',
    description: 'Kit completo com 30 peças para festa: 6 Caixas Milk, 6 Caixas Pirâmide, 6 Caixas Sushi, 6 Porta Bis Duplo e 6 Tubetes decorados no mesmo tema.',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=800',
    badge: 'Economia & Praticidade',
    popular: true,
    suggestedQuantities: [1, 2, 3],
    customizationOptions: ['Tema da Festa', 'Nome', 'Idade', 'Paleta de Cores Preferida']
  },
  {
    id: 'manual-padrinhos-elegante',
    title: 'Manual e Convite para Padrinhos de Casamento',
    category: 'casamentos',
    subCategory: 'convites',
    description: 'Brochura ou caixa dobrável em papel textured linen 240g com paleta de cores para padrinhos e madrinhas, traje sugerido, data e mensagem acolhedora.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
    badge: 'Casamentos',
    popular: true,
    suggestedQuantities: [6, 10, 12, 16],
    customizationOptions: ['Nomes dos Noivos', 'Data do Casamento', 'Paleta de Cores dos Trajes', 'Mensagem Exclusiva']
  },
  {
    id: 'convite-casamento-rustico-chic',
    title: 'Convite de Casamento Rústico Chic Floral',
    category: 'casamentos',
    subCategory: 'convites',
    description: 'Convite impresso em papel telado offset alta gramatura, envelope artesanal rendado, cordão de rami com raminho de flor desidratada e tag com nome do convidado.',
    image: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?auto=format&fit=crop&q=80&w=800',
    suggestedQuantities: [30, 50, 80, 100],
    customizationOptions: ['Texto do Convite', 'Nomes dos Noivos & Pais', 'Estilo de Flor Desidratada', 'Acompanha Individual']
  },
  {
    id: 'caixa-sushi-alca',
    title: 'Caixa Sushi com Alça e Apliques 3D',
    category: 'papelaria',
    subCategory: 'caixinhas',
    description: 'Caixa de guloseima com topo geométrico e alça delicada. Acompanha aplique recortado no tema e laço de fitilho metalizado.',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800',
    suggestedQuantities: [10, 20, 30],
    customizationOptions: ['Nome', 'Idade', 'Tema']
  },
  {
    id: 'porta-bis-duplo',
    title: 'Porta Bis Duplo Personalizado',
    category: 'papelaria',
    subCategory: 'caixinhas',
    description: 'Suporte encantador em papel offset para abrigar dois chocolates Bis. Ótima opção para preencher a mesa de doces com mimos combinando.',
    image: 'https://images.unsplash.com/photo-1582211594533-268f4f1edcb9?auto=format&fit=crop&q=80&w=800',
    suggestedQuantities: [20, 30, 50, 100],
    customizationOptions: ['Nome', 'Idade', 'Tema']
  },
  {
    id: 'lembrancinha-batizado-anjinho',
    title: 'Caixinha Acrílica Batizado com Mini Terço',
    category: 'festas',
    subCategory: 'lembrancinhas',
    description: 'Caixa acrílica 5x5cm decorada com laço de cetim, medalha de anjinho em relevo 3D e mini terço de pérolas prateadas/douradas na parte interna.',
    image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=800',
    badge: 'Batizado & Eucaristia',
    suggestedQuantities: [10, 15, 20, 30],
    customizationOptions: ['Nome da Criança', 'Data do Batizado', 'Cor das Pérolas']
  },
  {
    id: 'lembranca-corporativa-boas-vindas',
    title: 'Kit Boas-Vindas Corporativo Personalizado',
    category: 'casamentos',
    subCategory: 'corporativo',
    description: 'Caixa personalizada com a marca da sua empresa, contendo bloco de anotações capa dura, caneta artesanal e caixinha para bombons fina.',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800',
    badge: 'Corporativo',
    suggestedQuantities: [20, 50, 100, 200],
    customizationOptions: ['Logomarca da Empresa', 'Cores da Marca', 'Mensagem Institucional']
  },
  {
    id: 'sacolinha-kraft-surpresa',
    title: 'Sacolinha Surpresa Personalizada com Laço',
    category: 'festas',
    subCategory: 'lembrancinhas',
    description: 'Sacola em papel kraft ou offset branco de alta densidade, alça em fita de cetim e tag personalizada com o nome dos convidados ou mensagem de agradecimento.',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800',
    suggestedQuantities: [10, 20, 30, 50],
    customizationOptions: ['Nome', 'Idade', 'Tema', 'Frase de Agradecimento']
  }
];

export const TESTIMONIALS = [
  {
    id: '1',
    name: 'Carolina Mendes',
    event: 'Aniversário de 3 Anos da Helena - Tema Jardim Encantado',
    comment: 'Fiquei apaixonada pelos mimos! As caixinhas milk e o topo de bolo shaker deixaram a mesa perfeita. Todos os convidados elogiaram o capricho!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: '2',
    name: 'Juliana & Rodrigo',
    event: 'Casamento Rústico Chic',
    comment: 'Os manuais dos padrinhos e convites ficaram impecáveis. O atendimento da equipe foi super carinhoso do início ao fim.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: '3',
    name: 'Fernanda Oliveira',
    event: 'Chá de Bebê do Gabriel - Tema Bosque',
    comment: 'Atendimento nota 1000! O gerador de ideias com IA ajudou a definir o tema e a papelaria chegou bem embalada e pronta para encantar.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200'
  }
];
