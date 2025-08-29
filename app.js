const { useState, useEffect, useRef } = React;
const { createClient } = supabase;

// --- Configuración de Supabase ---
const supabaseUrl = 'https://genidguluqumknwtoqfm.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlbmlkZ3VsdXF1bWtud3RvcWZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MjY2MTQsImV4cCI6MjA2ODEwMjYxNH0.GNG_V-rkQWamqqyX4T1tWoh1hLEac_nJv40JX5o63WY';

let supabaseClient;
try {
    supabaseClient = createClient(supabaseUrl, supabaseKey);
} catch (error) {
    console.error("Error initializing Supabase. Please check your URL and Key.", error);
}

// --- Components ---
function ErrorDisplay({ message }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="m-4 max-w-lg">
                <div className="text-center p-8 bg-white rounded-lg shadow-xl">
                    <h2 className="font-bold text-2xl text-red-600 mb-4"><i className="fas fa-exclamation-triangle mr-2"></i>Acción Requerida</h2>
                    <p className="text-slate-700 text-left mb-4">La aplicación no puede iniciar porque una configuración necesaria está desactivada en tu proyecto de Supabase.</p>
                    <div className="text-left p-4 bg-red-50 border border-red-200 rounded-md">
                        <p className="font-semibold text-red-800">Error: {message}</p>
                    </div>
                    <p className="text-slate-700 text-left mt-4 mb-6">Para solucionarlo, por favor activa el inicio de sesión anónimo en tu panel de control de Supabase (Authentication -> Providers).</p>
                    <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="inline-block w-full bg-red-500 text-white font-bold py-3 px-4 rounded hover:bg-red-600 transition-colors">
                        <i className="fas fa-external-link-alt mr-2"></i> Ir al panel de Supabase para arreglarlo
                    </a>
                </div>
            </div>
        </div>
    );
}

function Notification({ message, type, onClear }) {
    useEffect(() => {
        const timer = setTimeout(() => { onClear(); }, 3000);
        return () => clearTimeout(timer);
    }, [onClear]);
    const baseClasses = "fixed bottom-5 right-5 p-4 rounded-lg shadow-lg text-white z-50 notification";
    const typeClasses = type === 'error' ? 'bg-red-500' : 'bg-green-500';
    return (<div className={`${baseClasses} ${typeClasses}`}><i className={`fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'} mr-2`}></i>{message}</div>);
}

function NamePicker({ onNameSet }) {
    const [name, setName] = useState('');
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFA1'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const handleSubmit = (e) => { e.preventDefault(); if (name.trim()) { onNameSet(name.trim(), randomColor); } };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">¡Bienvenido/a!</h2>
                <p className="text-slate-600 mb-6">Elige un nombre para identificarte en la sesión.</p>
                <form onSubmit={handleSubmit}>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre..." className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500" required />
                    <button type="submit" className="w-full mt-4 bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 transition">Unirse a la sesión</button>
                </form>
            </div>
        </div>
    );
}

function Cursor({ user }) {
    if (!user || !user.position) return null;
    return (<div className="cursor" style={{ left: `${user.position.x}px`, top: `${user.position.y}px`, color: user.color }} data-user={user.name}><i className="fas fa-mouse-pointer" style={{ transform: 'rotate(-10deg)', fontSize: '20px' }}></i></div>);
}

function QRCodeModal({ sessionId, onClose }) {
    const qrRef = useRef(null);
    const qrCodeInstance = useRef(null); // Ref to hold the QRCodeStyling instance
    const url = `${window.location.origin}${window.location.pathname}?session=${sessionId}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`¡Únete a la minuta!\n\n${url}`)}`;
    const emailUrl = `mailto:?subject=${encodeURIComponent("Invitación a la Minuta")}&body=${encodeURIComponent(`Hola,\n\nEstás invitado/a a participar en una minuta en tiempo real. Haz clic en el siguiente enlace para unirte:\n\n${url}\n\n¡Gracias!`)}`;

    useEffect(() => {
        if (qrRef.current && window.QRCodeStyling) {
            qrCodeInstance.current = new window.QRCodeStyling({
                width: 256,
                height: 256,
                data: url,
                dotsOptions: { color: "#4267b2", type: "rounded" },
                backgroundOptions: { color: "#ffffff" },
                cornersSquareOptions: { type: "extra-rounded" },
                cornersDotOptions: { type: "dot" }
            });
            qrRef.current.innerHTML = '';
            qrCodeInstance.current.append(qrRef.current);
        }
    }, [url]);
    
    const handleDownload = () => {
        if (qrCodeInstance.current) {
            qrCodeInstance.current.download({
                name: "minuta-qr",
                extension: "png"
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-8 text-center" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4">Invita a Participantes</h2>
                <p className="text-slate-600 mb-6">Escanea el código, descárgalo o comparte el enlace.</p>
                <div ref={qrRef} className="inline-block"></div>
                <div className="mt-6 flex gap-4">
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex-1 bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2">
                        <i className="fab fa-whatsapp"></i> WhatsApp
                    </a>
                    <a href={emailUrl} className="flex-1 bg-gray-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-600 transition flex items-center justify-center gap-2">
                        <i className="fas fa-envelope"></i> Correo
                    </a>
                </div>
                <div className="mt-4 flex gap-4">
                     <button onClick={handleDownload} className="flex-1 bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2">
                        <i className="fas fa-download"></i> Descargar QR
                    </button>
                    <button onClick={onClose} className="flex-1 bg-slate-200 text-slate-700 font-bold py-2 rounded-md hover:bg-slate-300 transition">Cerrar</button>
                </div>
            </div>
        </div>
    );
}

function MeetingRoom({ sessionId, session, userInfo }) {
    const [content, setContent] = useState("");
    const [users, setUsers] = useState({});
    const [actions, setActions] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [audioURL, setAudioURL] = useState('');
    const [notification, setNotification] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [showQRModal, setShowQRModal] = useState(false);
    
    const editorRef = useRef(null);
    const channelRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const showNotification = (message, type = 'success') => { setNotification({ message, type }); };

    // Presence and Cursors
    useEffect(() => {
        if (!session || !userInfo || !supabaseClient) return;

        const channel = supabaseClient.channel(`room-${sessionId}`, { config: { presence: { key: userInfo.name } } });
        channel.on('presence', { event: 'sync' }, () => {
            const presenceState = channel.presenceState();
            const activeUsers = {};
            for (const key in presenceState) { activeUsers[key] = presenceState[key][0]; }
            setUsers(activeUsers);
        });
        channel.on('broadcast', { event: 'cursor' }, ({ payload }) => {
            setUsers(prev => ({ ...prev, [payload.name]: { ...prev[payload.name], position: payload.position } }));
        });
        channel.subscribe(async (status) => { if (status === 'SUBSCRIBED') { await channel.track(userInfo); } });
        channelRef.current = channel;
        return () => { channel.unsubscribe(); };
    }, [session, userInfo, sessionId]);

    // Document and Role Sync
    useEffect(() => {
        if (!supabaseClient || !session) return;
        
        const fetchDoc = async () => {
            const { data } = await supabaseClient.from('documents').select('*').eq('id', sessionId).single();
            if (data) {
                setContent(data.content);
                setIsOwner(data.owner_id === session.user.id);
            }
        };
        fetchDoc();

        const subscription = supabaseClient.channel(`documents-${sessionId}`)
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'documents', filter: `id=eq.${sessionId}` }, payload => {
                setContent(payload.new.content);
            }).subscribe();
        return () => { subscription.unsubscribe(); };
    }, [sessionId, session]);
    
    // Actions Sync
    useEffect(() => {
        if (!supabaseClient) return;
        const fetchActions = async () => {
            const { data } = await supabaseClient.from('actions').select('*').eq('doc_id', sessionId);
            if (data) setActions(data);
        };
        fetchActions();

        const subscription = supabaseClient.channel(`actions-${sessionId}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'actions', filter: `doc_id=eq.${sessionId}` }, payload => {
                if (payload.eventType === 'INSERT') setActions(current => [...current, payload.new]);
                if (payload.eventType === 'DELETE') setActions(current => current.filter(a => a.id !== payload.old.id));
            }).subscribe();
        return () => { subscription.unsubscribe(); };
    }, [sessionId]);

    const handleContentChange = async (newContent) => {
        if (!isOwner) return;
        setContent(newContent);
        await supabaseClient.from('documents').update({ content: newContent }).eq('id', sessionId);
    };

    const handleMouseMove = (e) => {
        if (!userInfo || !editorRef.current || !channelRef.current) return;
        const rect = editorRef.current.getBoundingClientRect();
        const position = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        channelRef.current.send({ type: 'broadcast', event: 'cursor', payload: { name: userInfo.name, position } });
    };
    
    const addAction = async () => {
        const textInput = document.getElementById('newActionInput');
        const responsibleInput = document.getElementById('responsibleInput');
        const deadlineInput = document.getElementById('deadlineInput');
        if (textInput.value.trim() && session && isOwner) {
            const newAction = { text: textInput.value, responsible: responsibleInput.value, deadline: deadlineInput.value, user_id: session.user.id, doc_id: sessionId };
            await supabaseClient.from('actions').insert(newAction);
            textInput.value = ''; responsibleInput.value = ''; deadlineInput.value = '';
        }
    };

    const deleteAction = async (actionId) => {
        if (!isOwner) return;
        await supabaseClient.from('actions').delete().eq('id', actionId);
    };

    const handleStartRecording = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { showNotification("La grabación de audio no es soportada.", "error"); return; }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setIsRecording(true);
            audioChunksRef.current = [];
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.ondataavailable = (event) => { audioChunksRef.current.push(event.data); };
            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                setAudioURL(URL.createObjectURL(audioBlob));
                stream.getTracks().forEach(track => track.stop());
            };
            mediaRecorderRef.current.start();
        } catch (err) { showNotification("No se pudo acceder al micrófono.", "error"); }
    };

    const handleStopRecording = () => { if (mediaRecorderRef.current) { mediaRecorderRef.current.stop(); setIsRecording(false); } };

    return (
        <div className="container mx-auto p-4 md:p-6">
            {notification && <Notification message={notification.message} type={notification.type} onClear={() => setNotification(null)} />}
            {showQRModal && <QRCodeModal sessionId={sessionId} onClose={() => setShowQRModal(false)} />}
            <header className="bg-white rounded-xl shadow-md p-4 flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-3"><i className="fas fa-users"></i> Minutería Colaborativa</h1>
                <div className="flex items-center gap-3">
                     {isOwner && <button onClick={isRecording ? handleStopRecording : handleStartRecording} className={`flex items-center gap-2 text-white font-bold py-2 px-4 rounded-lg transition-all ${isRecording ? 'bg-red-500 recording-pulse' : 'bg-gray-700 hover:bg-gray-800'}`}><i className={`fas ${isRecording ? 'fa-stop-circle' : 'fa-microphone'}`}></i>{isRecording ? 'Detener' : 'Grabar'}</button>}
                     {isOwner && <button onClick={() => setShowQRModal(true)} className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"><i className="fas fa-qrcode"></i>Invitar</button>}
                    <span className="text-sm text-slate-600 hidden sm:inline">Online:</span>
                    <div className="flex -space-x-2">{Object.entries(users).map(([key, u]) => (u && u.name && <div key={key} className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white font-bold" style={{ backgroundColor: u.color }} title={u.name}>{u.name.charAt(0)}</div>))}</div>
                </div>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-4 bg-slate-50 border-b border-slate-200"><h2 className="text-lg font-semibold">Reunión de Sincronización</h2><p className="text-sm text-slate-500">ID de Sesión: {sessionId}</p></div>
                        <div className="relative min-h-[500px] p-4" ref={editorRef} onMouseMove={handleMouseMove}>
                            {Object.entries(users).map(([key, u]) => (u && u.name !== userInfo.name) ? <Cursor key={key} user={u} /> : null)}
                            <textarea readOnly={!isOwner} className={`w-full h-full absolute top-0 left-0 p-4 bg-transparent resize-none outline-none text-base leading-relaxed text-slate-800 ${!isOwner ? 'cursor-not-allowed' : ''}`} style={{ minHeight: '500px' }} value={content} onChange={(e) => handleContentChange(e.target.value)} />
                        </div>
                    </div>
                     {audioURL && (<div className="bg-white rounded-xl shadow-md p-4"><h3 className="text-md font-semibold mb-2 text-slate-700">Grabación de Audio</h3><audio src={audioURL} controls className="w-full"></audio></div>)}
                </div>
                
                <div className="bg-white rounded-xl shadow-md p-5 space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-blue-600">Acciones Pendientes</h3>
                        <div id="actionsList" className="space-y-3 max-h-60 overflow-y-auto pr-2">
                            {actions.length > 0 ? actions.map((action) => (
                                <div key={action.id} className="action-item bg-slate-50 p-2 rounded-md border border-slate-200 flex justify-between items-center text-sm">
                                    <div className="flex-grow"><p className="font-medium">{action.text}</p><div className="text-xs text-slate-500 flex gap-3">{action.responsible && <span><i className="fas fa-user"></i> {action.responsible}</span>}{action.deadline && <span><i className="fas fa-calendar-alt"></i> {action.deadline}</span>}</div></div>
                                    {isOwner && <button className="delete-action text-red-500 hover:text-red-700 ml-2 p-1" onClick={() => deleteAction(action.id)}><i className="fas fa-trash"></i></button>}
                                </div>
                            )) : <p className="text-sm text-slate-500 text-center">No hay acciones.</p>}
                        </div>
                    </div>
                    {isOwner && <div className="border-t pt-4">
                        <h3 className="text-lg font-semibold mb-4 text-blue-600">Añadir Acción</h3>
                        <div className="space-y-3">
                            <input type="text" id="newActionInput" placeholder="Nueva acción..." className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"/>
                            <input type="text" id="responsibleInput" placeholder="Responsable..." className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"/>
                            <input type="date" id="deadlineInput" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"/>
                            <button className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2" onClick={addAction}><i className="fas fa-plus"></i> Añadir</button>
                        </div>
                    </div>}
                </div>
            </div>
        </div>
    );
}

function App() {
    const [session, setSession] = useState(null);
    const [userInfo, setUserInfo] = useState(() => {
        try {
            const saved = sessionStorage.getItem('minuteriaUserInfo');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });
    const [sessionId, setSessionId] = useState(null);
    const [authError, setAuthError] = useState(null);

    // Auth
    useEffect(() => {
        if (!supabaseClient) return;
        
        const setupSession = async () => {
            const { data: { session } } = await supabaseClient.auth.getSession();
            if (session) {
                setSession(session);
            } else {
                const { data: { session: newSession }, error } = await supabaseClient.auth.signInAnonymously();
                if (error) {
                    console.error("Error signing in anonymously:", error);
                    if (error.message.includes("Anonymous sign-ins are disabled")) {
                        setAuthError("El inicio de sesión anónimo está deshabilitado.");
                    }
                } else {
                    setSession(newSession);
                }
            }
        };
        setupSession();

        const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
        return () => subscription.unsubscribe();
    }, []);
    
    // Session from URL
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const sessionParam = urlParams.get('session');
        if (sessionParam) {
            setSessionId(sessionParam);
        }
    }, []);

    const handleSetUserInfo = (name, color) => {
        const info = { name, color };
        sessionStorage.setItem('minuteriaUserInfo', JSON.stringify(info));
        setUserInfo(info);
    };

    const createNewMeeting = async () => {
        if (!session) {
            alert("Estableciendo sesión segura... Por favor, inténtalo de nuevo en un momento.");
            return;
        }
        const newId = Math.random().toString(36).substring(2, 10);
        const { error } = await supabaseClient.from('documents').insert({ id: newId, content: `## Minuta de Reunión - ${new Date().toLocaleDateString()}\n\n- Escribe aquí para empezar.`, owner_id: session.user.id });
        if (error) {
            console.error("Error creating document:", error);
            alert(`Hubo un error al crear la minuta. Es posible que necesites configurar las Políticas de Seguridad (RLS) en tu tabla 'documents' de Supabase para permitir inserciones.`);
        } else {
            try {
                const url = new URL(window.location);
                url.searchParams.set('session', newId);
                window.history.pushState({}, '', url);
            } catch (e) {
                console.warn("Could not update URL via pushState. This is expected in sandboxed environments.");
            }
            setSessionId(newId);
        }
    };

    if (authError) {
        return <ErrorDisplay message={authError} />;
    }

    if (!supabaseClient) {
         return (<div className="m-4"><div className="text-center p-8 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-lg shadow-md"><h2 className="font-bold text-xl mb-2">Configuración Incompleta</h2><p>Reemplaza las credenciales de Supabase en el código para conectar la aplicación.</p></div></div>);
    }
    
    if (!userInfo) {
        return <NamePicker onNameSet={handleSetUserInfo} />;
    }

    if (!sessionId) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-6">Minutería Colaborativa</h1>
                    <button onClick={createNewMeeting} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg">
                        <i className="fas fa-plus mr-2"></i> Crear Nueva Minuta
                    </button>
                </div>
            </div>
        );
    }

    return <MeetingRoom sessionId={sessionId} session={session} userInfo={userInfo} />;
}

// --- Render the App ---
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);

