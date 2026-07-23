import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  arrayUnion, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { CustomerUser, OrderModel, OrderStatus, FinalProductPhoto } from '../types';

// Standardized phone sanitizer (keeps only digits)
export const sanitizePhone = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

// Local storage keys
const LOCAL_USER_KEY = 'mimos_current_user';
const LOCAL_ORDERS_KEY = 'mimos_local_orders';

// Save or login customer user
export const saveCustomerProfile = async (user: CustomerUser): Promise<CustomerUser> => {
  const cleanPhone = sanitizePhone(user.phone || '');
  const activeUid = user.uid || auth.currentUser?.uid || '';
  const activeEmail = user.email || auth.currentUser?.email || '';

  const userProfile: CustomerUser = {
    ...user,
    uid: activeUid || user.uid,
    email: activeEmail || user.email,
    phone: cleanPhone || user.phone,
    createdAt: user.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Save in Local Storage
  localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(userProfile));

  // Save to Firestore collections 'users' and 'clientes' with immediate verification check
  const docId = activeUid || cleanPhone;
  if (!docId) {
    throw new Error('Não foi possível identificar o ID do usuário (UID ou WhatsApp).');
  }

  const clienteRef = doc(db, 'clientes', docId);
  const clientePayload = {
    uid: activeUid,
    email: activeEmail,
    nome: user.name || '',
    name: user.name || '',
    whatsapp: cleanPhone || user.phone || '',
    phone: cleanPhone || user.phone || '',
    cep: user.cep || '',
    endereco: user.endereco || '',
    numero: user.numero || '',
    complemento: user.complemento || '',
    bairro: user.bairro || '',
    cidade: user.cidade || '',
    estado: user.estado || '',
    cityState: user.cityState || (user.cidade && user.estado ? `${user.cidade} - ${user.estado}` : ''),
    atualizadoEm: serverTimestamp(),
    updatedAt: userProfile.updatedAt,
  };

  // Step 1: Gravar no Firestore
  try {
    const promises: Promise<any>[] = [
      setDoc(clienteRef, clientePayload, { merge: true })
    ];

    if (cleanPhone) {
      const userRef = doc(db, 'users', cleanPhone);
      promises.push(setDoc(userRef, userProfile, { merge: true }));
    }

    await Promise.all(promises);
    console.log('✅ Gravação concluída no Firestore. Iniciando verificação de salvamento...');
  } catch (err: any) {
    console.error('❌ Erro durante gravação no Firestore:', err);
    throw new Error(`Erro na gravação do Firestore: ${err?.message || err}`);
  }

  // Step 2: VERIFICAÇÃO imediata lendo do banco Firestore
  try {
    const checkSnap = await getDoc(clienteRef);
    if (!checkSnap.exists()) {
      throw new Error(`Falha de Verificação: O documento de ID '${docId}' não foi encontrado na coleção 'clientes' do Firestore.`);
    }

    const verifiedData = checkSnap.data();
    console.log('✅ Verificação confirmada com sucesso no Firestore! Dados lidos do banco:', verifiedData);
  } catch (err: any) {
    console.error('❌ Erro durante verificação no Firestore:', err);
    throw new Error(`Falha ao verificar os dados no Firestore após salvar: ${err?.message || err}`);
  }

  return userProfile;
};

// Fetch customer profile from Firestore ('clientes' or 'users')
export const fetchCustomerProfileFromFirestore = async (userUid?: string, phone?: string): Promise<CustomerUser | null> => {
  try {
    const activeUid = userUid || auth.currentUser?.uid;
    const cleanPhone = phone ? sanitizePhone(phone) : '';

    if (activeUid) {
      const docRef = doc(db, 'clientes', activeUid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        return {
          uid: data.uid || activeUid,
          name: data.nome || data.name || '',
          email: data.email || '',
          phone: data.whatsapp || data.phone || cleanPhone || '',
          cep: data.cep || '',
          endereco: data.endereco || '',
          numero: data.numero || '',
          complemento: data.complemento || '',
          bairro: data.bairro || '',
          cidade: data.cidade || '',
          estado: data.estado || '',
          cityState: data.cityState || (data.cidade && data.estado ? `${data.cidade} - ${data.estado}` : ''),
          createdAt: data.createdAt || '',
          updatedAt: data.updatedAt || '',
        };
      }
    }

    if (cleanPhone) {
      const docRef = doc(db, 'users', cleanPhone);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as CustomerUser;
      }
    }
  } catch (err) {
    console.error('Erro ao carregar perfil do cliente no Firestore:', err);
  }
  return null;
};

// Ensure customer document exists in 'clientes' collection upon login/auth change
export const ensureCustomerDocInFirestore = async (firebaseUser: { uid: string; displayName?: string | null; email?: string | null; phoneNumber?: string | null }): Promise<CustomerUser> => {
  const localUser = getCurrentCustomerUser();
  const activeUid = firebaseUser.uid;

  let loadedUser: CustomerUser = {
    uid: activeUid,
    name: firebaseUser.displayName || localUser?.name || 'Cliente Mimos',
    email: firebaseUser.email || localUser?.email || '',
    phone: firebaseUser.phoneNumber || localUser?.phone || '',
    photoURL: localUser?.photoURL || '',
    cep: localUser?.cep || '',
    endereco: localUser?.endereco || '',
    numero: localUser?.numero || '',
    complemento: localUser?.complemento || '',
    bairro: localUser?.bairro || '',
    cidade: localUser?.cidade || '',
    estado: localUser?.estado || '',
    cityState: localUser?.cityState || '',
  };

  try {
    const docRef = doc(db, 'clientes', activeUid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      // Se o cliente é novo no Firestore, cria o documento inicial no Firestore
      const initialData = {
        uid: activeUid,
        nome: firebaseUser.displayName || localUser?.name || 'Cliente sem nome',
        name: firebaseUser.displayName || localUser?.name || 'Cliente sem nome',
        email: firebaseUser.email || localUser?.email || '',
        whatsapp: firebaseUser.phoneNumber || localUser?.phone || '',
        phone: firebaseUser.phoneNumber || localUser?.phone || '',
        cep: localUser?.cep || '',
        endereco: localUser?.endereco || '',
        numero: localUser?.numero || '',
        complemento: localUser?.complemento || '',
        bairro: localUser?.bairro || '',
        cidade: localUser?.cidade || '',
        estado: localUser?.estado || '',
        cityState: localUser?.cityState || '',
        criadoEm: serverTimestamp(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(docRef, initialData, { merge: true });
      console.log('Novo cliente salvo no Firestore com sucesso!');
    } else {
      // Documento já existe, carrega e mescla as informações do Firestore
      const data = docSnap.data();
      loadedUser = {
        ...loadedUser,
        name: data.nome || data.name || loadedUser.name,
        email: data.email || loadedUser.email,
        phone: data.whatsapp || data.phone || loadedUser.phone,
        cep: data.cep || loadedUser.cep,
        endereco: data.endereco || loadedUser.endereco,
        numero: data.numero || loadedUser.numero,
        complemento: data.complemento || loadedUser.complemento,
        bairro: data.bairro || loadedUser.bairro,
        cidade: data.cidade || loadedUser.cidade,
        estado: data.estado || loadedUser.estado,
        cityState: data.cityState || (data.cidade && data.estado ? `${data.cidade} - ${data.estado}` : loadedUser.cityState),
      };
    }

    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(loadedUser));
  } catch (err) {
    console.error('Erro ao salvar/carregar cliente no Firestore durante o login:', err);
  }

  return loadedUser;
};

// Delete Client Account and Anonymize Data (LGPD Right to be Forgotten)
export const deleteClientAccountAndAnonymize = async (userUid?: string, phone?: string): Promise<void> => {
  const cleanPhone = phone ? sanitizePhone(phone) : '';

  try {
    // 1. Delete from 'clientes' collection
    if (userUid) {
      await deleteDoc(doc(db, 'clientes', userUid)).catch(() => {});
    }
    if (cleanPhone) {
      await deleteDoc(doc(db, 'clientes', cleanPhone)).catch(() => {});
      await deleteDoc(doc(db, 'users', cleanPhone)).catch(() => {});
    }

    // 2. Anonymize past orders in 'orcamentos' & 'orders' collections
    try {
      const orcamentosRef = collection(db, 'orcamentos');
      const orcamentosSnap = await getDocs(orcamentosRef);
      orcamentosSnap.forEach(async (docSnap) => {
        const data = docSnap.data();
        if ((userUid && data.uid === userUid) || (cleanPhone && sanitizePhone(data.whatsapp || data.customerPhone || '') === cleanPhone)) {
          await updateDoc(doc(db, 'orcamentos', docSnap.id), {
            customerName: 'Cliente Anônimo (LGPD)',
            nomeCliente: 'Cliente Anônimo (LGPD)',
            whatsapp: 'Anônimo',
            customerPhone: 'Anônimo',
            cidade: '',
            cityState: '',
            observacoesEntrega: '[Dados Pessoais Removidos - LGPD]',
            generalNotes: '[Dados Pessoais Removidos - LGPD]',
            uid: 'lgpd_deleted',
          }).catch(() => {});
        }
      });

      const ordersRef = collection(db, 'orders');
      const ordersSnap = await getDocs(ordersRef);
      ordersSnap.forEach(async (docSnap) => {
        const data = docSnap.data();
        if ((userUid && data.uid === userUid) || (cleanPhone && sanitizePhone(data.customerPhone || '') === cleanPhone)) {
          await updateDoc(doc(db, 'orders', docSnap.id), {
            customerName: 'Cliente Anônimo (LGPD)',
            customerPhone: 'Anônimo',
            cityState: '',
            generalNotes: '[Dados Pessoais Removidos - LGPD]',
            uid: 'lgpd_deleted',
          }).catch(() => {});
        }
      });
    } catch (e) {
      console.warn('Error anonymizing orders:', e);
    }

    // 3. Delete Firebase Authentication user
    if (auth.currentUser) {
      try {
        await auth.currentUser.delete();
      } catch (authErr) {
        console.warn('Firebase Auth user delete warning:', authErr);
      }
    }
  } catch (err) {
    console.error('Error during client profile deletion:', err);
  } finally {
    // 4. Remove local profile data and log off
    localStorage.removeItem(LOCAL_USER_KEY);
  }
};

// Get current logged in user from localStorage
export const getCurrentCustomerUser = (): CustomerUser | null => {
  try {
    const saved = localStorage.getItem(LOCAL_USER_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

// Logout
export const logoutCustomerUser = () => {
  localStorage.removeItem(LOCAL_USER_KEY);
};

// Create a new Order in Firestore
export const createOrderInFirestore = async (orderData: Partial<OrderModel>): Promise<OrderModel> => {
  const cleanPhone = sanitizePhone(orderData.customerPhone || '');
  const orderNumber = `#MIMO-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString();

  const newOrder: OrderModel = {
    id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    orderNumber,
    uid: orderData.uid || '',
    customerPhone: cleanPhone,
    customerName: orderData.customerName || 'Cliente',
    eventDate: orderData.eventDate || '',
    cityState: orderData.cityState || '',
    generalNotes: orderData.generalNotes || '',
    items: orderData.items || [],
    status: orderData.status || 'solicitado',
    statusHistory: [
      {
        status: 'solicitado',
        timestamp: now,
        note: 'Orçamento solicitado com sucesso! O Ateliê Mãos que Produzem Mimos está analisando os detalhes.',
      }
    ],
    finalPhotos: [],
    createdAt: now,
    updatedAt: now,
  };

  // Save locally first
  try {
    const localSaved = localStorage.getItem(LOCAL_ORDERS_KEY);
    const existingOrders: OrderModel[] = localSaved ? JSON.parse(localSaved) : [];
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify([newOrder, ...existingOrders]));
  } catch (e) {
    console.error('Error saving order locally:', e);
  }

  // Save to Firestore 'orcamentos' and 'orders' collections
  try {
    // Primary collection requested by user specification: 'orcamentos'
    const orcamentoDocRef = doc(db, 'orcamentos', newOrder.id);
    await setDoc(orcamentoDocRef, {
      ...newOrder,
      uid: newOrder.uid,
      nomeCliente: newOrder.customerName,
      whatsapp: newOrder.customerPhone,
      dataEvento: newOrder.eventDate,
      cidade: newOrder.cityState,
      observacoesEntrega: newOrder.generalNotes,
      listaProdutos: newOrder.items,
      dataSolicitacao: newOrder.createdAt,
      statusDisplay: 'Pendente',
    });

    // Secondary collection for legacy compatibility: 'orders'
    const orderDocRef = doc(db, 'orders', newOrder.id);
    await setDoc(orderDocRef, newOrder);
  } catch (err) {
    console.warn('Firestore order create warning:', err);
  }

  return newOrder;
};

// Subscribe to orders for a specific customer (by uid or phone)
export const subscribeCustomerOrders = (
  phoneOrUid: string, 
  callback: (orders: OrderModel[]) => void,
  userUid?: string
) => {
  const cleanPhone = sanitizePhone(phoneOrUid);
  const uidToSearch = userUid || (phoneOrUid.length > 15 ? phoneOrUid : '');

  try {
    // Listen to 'orcamentos' collection
    const orcamentosRef = collection(db, 'orcamentos');
    const ordersRef = collection(db, 'orders');

    const unsubscribe = onSnapshot(orcamentosRef, (snapshot) => {
      const ordersList: OrderModel[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as any;
        // Filter by uid or phone
        const matchesUid = uidToSearch && data.uid === uidToSearch;
        const matchesPhone = cleanPhone && (sanitizePhone(data.customerPhone || data.whatsapp || '') === cleanPhone);

        if (matchesUid || matchesPhone) {
          // Normalize to OrderModel format
          const normalizedOrder: OrderModel = {
            id: data.id || docSnap.id,
            orderNumber: data.orderNumber || `#MIMO-${docSnap.id.substring(0, 4)}`,
            uid: data.uid || '',
            customerPhone: data.customerPhone || data.whatsapp || '',
            customerName: data.customerName || data.nomeCliente || 'Cliente',
            eventDate: data.eventDate || data.dataEvento || '',
            cityState: data.cityState || data.cidade || '',
            generalNotes: data.generalNotes || data.observacoesEntrega || '',
            items: data.items || data.listaProdutos || [],
            status: data.status || 'solicitado',
            statusHistory: data.statusHistory || [
              {
                status: data.status || 'solicitado',
                timestamp: data.createdAt || data.dataSolicitacao || new Date().toISOString(),
                note: 'Orçamento solicitado com sucesso!'
              }
            ],
            finalPhotos: data.finalPhotos || [],
            createdAt: data.createdAt || data.dataSolicitacao || new Date().toISOString(),
            updatedAt: data.updatedAt || new Date().toISOString(),
          };

          ordersList.push(normalizedOrder);
        }
      });

      // Also fetch from legacy 'orders' collection if orcamentos snapshot didn't capture all
      getDocs(ordersRef).then((ordersSnap) => {
        ordersSnap.forEach((docSnap) => {
          const o = docSnap.data() as OrderModel;
          const matchesUid = uidToSearch && o.uid === uidToSearch;
          const matchesPhone = cleanPhone && (sanitizePhone(o.customerPhone) === cleanPhone);
          if (matchesUid || matchesPhone) {
            if (!ordersList.some(item => item.id === o.id)) {
              ordersList.push(o);
            }
          }
        });

        // Sort by newest created
        ordersList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        // Merge with local orders
        const localSaved = localStorage.getItem(LOCAL_ORDERS_KEY);
        const localOrders: OrderModel[] = localSaved ? JSON.parse(localSaved) : [];
        const userLocalOrders = localOrders.filter(o => 
          (uidToSearch && o.uid === uidToSearch) || (cleanPhone && sanitizePhone(o.customerPhone) === cleanPhone)
        );

        const orderMap = new Map<string, OrderModel>();
        ordersList.forEach(o => orderMap.set(o.id, o));
        userLocalOrders.forEach(o => {
          if (!orderMap.has(o.id)) orderMap.set(o.id, o);
        });

        const combined = Array.from(orderMap.values()).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        callback(combined);
      }).catch((err) => {
        console.warn('Orders fetch error:', err);
        ordersList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        callback(ordersList);
      });

    }, (error) => {
      console.warn('Firestore real-time subscription error, using local fallback:', error);
      const localSaved = localStorage.getItem(LOCAL_ORDERS_KEY);
      const localOrders: OrderModel[] = localSaved ? JSON.parse(localSaved) : [];
      const userLocal = localOrders.filter(o => 
        (uidToSearch && o.uid === uidToSearch) || (cleanPhone && sanitizePhone(o.customerPhone) === cleanPhone)
      );
      callback(userLocal);
    });

    return unsubscribe;
  } catch (err) {
    console.warn('Firestore subscription exception:', err);
    const localSaved = localStorage.getItem(LOCAL_ORDERS_KEY);
    const localOrders: OrderModel[] = localSaved ? JSON.parse(localSaved) : [];
    const userLocal = localOrders.filter(o => 
      (uidToSearch && o.uid === uidToSearch) || (cleanPhone && sanitizePhone(o.customerPhone) === cleanPhone)
    );
    callback(userLocal);
    return () => {};
  }
};

// Subscribe to ALL orders (for Ateliê Admin View)
export const subscribeAllOrders = (callback: (orders: OrderModel[]) => void) => {
  try {
    const ordersRef = collection(db, 'orders');
    const unsubscribe = onSnapshot(ordersRef, (snapshot) => {
      const ordersList: OrderModel[] = [];
      snapshot.forEach((docSnap) => {
        ordersList.push(docSnap.data() as OrderModel);
      });
      ordersList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      // Combine with local orders if any
      const localSaved = localStorage.getItem(LOCAL_ORDERS_KEY);
      const localOrders: OrderModel[] = localSaved ? JSON.parse(localSaved) : [];

      const orderMap = new Map<string, OrderModel>();
      ordersList.forEach(o => orderMap.set(o.id, o));
      localOrders.forEach(o => {
        if (!orderMap.has(o.id)) orderMap.set(o.id, o);
      });

      const combined = Array.from(orderMap.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      callback(combined);
    }, (error) => {
      console.warn('Admin subscription error:', error);
      const localSaved = localStorage.getItem(LOCAL_ORDERS_KEY);
      const localOrders: OrderModel[] = localSaved ? JSON.parse(localSaved) : [];
      callback(localOrders);
    });

    return unsubscribe;
  } catch (err) {
    const localSaved = localStorage.getItem(LOCAL_ORDERS_KEY);
    const localOrders: OrderModel[] = localSaved ? JSON.parse(localSaved) : [];
    callback(localOrders);
    return () => {};
  }
};

// Update Order status in Firestore & local
export const updateOrderStatusInFirestore = async (
  orderId: string, 
  newStatus: OrderStatus, 
  note?: string
) => {
  const now = new Date().toISOString();

  let noteText = note;
  if (!noteText) {
    switch (newStatus) {
      case 'solicitado':
        noteText = 'Orçamento recebido pelo Ateliê.';
        break;
      case 'em_producao':
        noteText = 'Arte gráfica aprovada e materiais recortados! Seu mimo está em processo de montagem artesanal.';
        break;
      case 'pronto':
        noteText = 'Seus mimos e caixinhas estão 100% finalizados e embalados com carinho!';
        break;
      case 'entregue':
        noteText = 'Pedido entregue com sucesso! Agradecemos por permitir fazer parte da sua celebração. ❤️';
        break;
      case 'cancelado':
        noteText = 'Pedido cancelado.';
        break;
    }
  }

  const historyItem = {
    status: newStatus,
    timestamp: now,
    note: noteText,
  };

  // Update in Local Storage
  try {
    const localSaved = localStorage.getItem(LOCAL_ORDERS_KEY);
    if (localSaved) {
      const orders: OrderModel[] = JSON.parse(localSaved);
      const updated = orders.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            status: newStatus,
            updatedAt: now,
            statusHistory: [...o.statusHistory, historyItem],
          };
        }
        return o;
      });
      localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(updated));
    }
  } catch (e) {
    console.error(e);
  }

  // Update in Firestore ('orders' and 'orcamentos')
  try {
    const orderDocRef = doc(db, 'orders', orderId);
    await updateDoc(orderDocRef, {
      status: newStatus,
      updatedAt: now,
      statusHistory: arrayUnion(historyItem),
    }).catch(() => {});

    const orcamentoDocRef = doc(db, 'orcamentos', orderId);
    await updateDoc(orcamentoDocRef, {
      status: newStatus,
      statusDisplay: newStatus === 'solicitado' ? 'Pendente' : newStatus === 'em_producao' ? 'Em Produção' : newStatus === 'pronto' ? 'Pronto' : newStatus === 'entregue' ? 'Entregue' : 'Cancelado',
      updatedAt: now,
      statusHistory: arrayUnion(historyItem),
    }).catch(() => {});
  } catch (err) {
    console.warn('Firestore update status warning:', err);
  }
};

// Add final photo to Order in Firestore & local
export const addFinalPhotoToOrderInFirestore = async (
  orderId: string, 
  photoUrl: string, 
  caption?: string
) => {
  const newPhoto: FinalProductPhoto = {
    id: `photo_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    url: photoUrl,
    caption: caption || 'Fotos reais do produto finalizado pelo Ateliê',
    uploadedAt: new Date().toISOString(),
  };

  // Local storage update
  try {
    const localSaved = localStorage.getItem(LOCAL_ORDERS_KEY);
    if (localSaved) {
      const orders: OrderModel[] = JSON.parse(localSaved);
      const updated = orders.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            finalPhotos: [...(o.finalPhotos || []), newPhoto],
            updatedAt: new Date().toISOString(),
          };
        }
        return o;
      });
      localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(updated));
    }
  } catch (e) {
    console.error(e);
  }

  // Firestore update
  try {
    const orderDocRef = doc(db, 'orders', orderId);
    await updateDoc(orderDocRef, {
      finalPhotos: arrayUnion(newPhoto),
      updatedAt: new Date().toISOString(),
    }).catch(() => {});

    const orcamentoDocRef = doc(db, 'orcamentos', orderId);
    await updateDoc(orcamentoDocRef, {
      finalPhotos: arrayUnion(newPhoto),
      updatedAt: new Date().toISOString(),
    }).catch(() => {});
  } catch (err) {
    console.warn('Firestore photo update warning:', err);
  }
};

// Seed a sample order with photos for testing/demonstration
export const seedSampleOrderForUser = async (user: CustomerUser): Promise<OrderModel> => {
  const cleanPhone = sanitizePhone(user.phone);
  const sampleOrder: OrderModel = {
    id: `demo_${cleanPhone}_1`,
    orderNumber: '#MIMO-9821',
    customerPhone: cleanPhone,
    customerName: user.name,
    eventDate: '25/11/2026',
    cityState: user.cityState || 'São Paulo - SP',
    generalNotes: 'Kit completo de festa no tema Jardim Encantado com laço de cera e detalhes em dourado.',
    items: [
      {
        id: 'item-demo-1',
        product: {
          id: '1',
          title: 'Caixinha Milk Luxo 3D',
          category: 'festas',
          subCategory: 'caixinhas',
          description: 'Caixa Milk artesanal com laço duplo em cetim, apliques em camadas 3D e papel offset 180g.',
          image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800',
          suggestedQuantities: [10, 20, 30],
          customizationOptions: ['Tema', 'Nome', 'Idade'],
        },
        quantity: 20,
        theme: 'Jardim Encantado das Borboletas',
        childName: 'Clara',
        age: '1 Ano',
        notes: 'Adicionar fitilho de cetim tom rosa seco e nome em glitter dourado.',
      },
      {
        id: 'item-demo-2',
        product: {
          id: '2',
          title: 'Topo de Bolo Shaker Interativo',
          category: 'festas',
          subCategory: 'topos_bolo',
          description: 'Topo de bolo com cúpula de acrílico recheada de lantejoulas e miçangas com efeito shaker.',
          image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&q=80&w=800',
          suggestedQuantities: [1],
          customizationOptions: ['Tema', 'Nome', 'Idade', 'Cor do Acrílico'],
        },
        quantity: 1,
        theme: 'Jardim Encantado',
        childName: 'Clara',
        age: '1 Ano',
        notes: 'Shaker com miçangas pérola e flores de papel no rodapé.',
      }
    ],
    status: 'pronto',
    statusHistory: [
      {
        status: 'solicitado',
        timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
        note: 'Orçamento solicitado pelo cliente e recebido com carinho pelo Ateliê.',
      },
      {
        status: 'em_producao',
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        note: 'Arte gráfica do Jardim Encantado aprovada! Recortes das borboletas e laços iniciados.',
      },
      {
        status: 'pronto',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        note: 'Tudo pronto! Fotos reais do produto finalizado adicionadas à galeria do pedido.',
      }
    ],
    finalPhotos: [
      {
        id: 'photo-demo-1',
        url: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800',
        caption: 'Caixinhas Milk Luxo recortadas e montadas à mão com laço seco e camadas borboleta 3D.',
        uploadedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      },
      {
        id: 'photo-demo-2',
        url: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&q=80&w=800',
        caption: 'Detalhe do Topo de Bolo Shaker pronto com efeito borboleta tridimensional.',
        uploadedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'photo-demo-3',
        url: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=800',
        caption: 'Kit embalado e pronto para entrega ou envio pelos Correios!',
        uploadedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  };

  // Save to local & Firestore
  try {
    const orderDocRef = doc(db, 'orders', sampleOrder.id);
    await setDoc(orderDocRef, sampleOrder);
  } catch (err) {
    console.warn('Error seeding sample order to Firestore:', err);
  }

  try {
    const localSaved = localStorage.getItem(LOCAL_ORDERS_KEY);
    const existing: OrderModel[] = localSaved ? JSON.parse(localSaved) : [];
    if (!existing.some(o => o.id === sampleOrder.id)) {
      localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify([sampleOrder, ...existing]));
    }
  } catch (e) {
    console.error(e);
  }

  return sampleOrder;
};
