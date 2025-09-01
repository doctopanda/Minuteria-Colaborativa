const { useState, useEffect, useRef } = React;
const { createClient } = supabase;

// --- Configuración de Supabase ---
const supabaseUrl = 'https://genidguluqumknwtoqfm.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlbmlkZ3VsdXF1bWtud3RvcWZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MjY2MTQsImV4cCI6MjA2ODEwMjYxNH0.GNG_V-rkQWamqqyX4T1tWoh1hLEac_nJv40JX5o63WY';

let supabaseClient;
try {
    if (supabaseUrl && supabaseKey && supabaseUrl !== 'https://tu-proyecto.supabase.co') {
         supabaseClient = createClient(supabaseUrl, supabaseKey);
    }
} catch (error) {
    console.error("Error initializing Supabase. Please check your URL and Key.", error);
}

// --- Components ---
function ErrorDisplay({ message, isKeyError = false }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="m-4 max-w-lg">
                <div className="text-center p-8 bg-white rounded-lg shadow-xl">
                    <h2 className="font-bold text-2xl text-red-600 mb-4"><i className="fas fa-exclamation-triangle mr-2"></i>Error de Configuración</h2>
                    <p className="text-slate-700 text-left mb-4">La aplicación no puede iniciar debido a un problema con la configuración de Supabase.</p>
                    <div className="text-left p-4 bg-red-50 border border-red-200 rounded-md">
                        <p className="font-semibold text-red-800">Error: {message}</p>
                    </div>
                    <p className="text-slate-700 text-left mt-4 mb-6">
                        {isKeyError 
                            ? "Por favor, verifica que la 'URL' y la 'Clave Pública (anon key)' en el código sean correctas. Puedes obtenerlas desde el panel de tu proyecto en Supabase."
                            : "Para solucionarlo, por favor activa el inicio de sesión anónimo en tu panel de control de Supabase (Authentication -> Providers)."
                        }
                    </p>
                    <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="inline-block w-full bg-red-500 text-white font-bold py-3 px-4 rounded hover:bg-red-600 transition-colors">
                        <i className="fas fa-external-link-alt mr-2"></i> Ir al panel de Supabase
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
    const qrCodeInstance = useRef(null);
    const url = `${window.location.origin}${window.location.pathname}?session=${sessionId}`;
    
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
            qrCodeInstance.current.download({ name: "minuta-qr", extension: "png" });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-8 text-center" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4">Invita a Participantes</h2>
                <p className="text-slate-600 mb-6">Escanea el código para unirte o descárgalo para compartir.</p>
                <div ref={qrRef} className="inline-block"></div>
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                     <button onClick={handleDownload} className="flex-1 bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2"><i className="fas fa-download"></i> Descargar QR</button>
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
    const [participants, setParticipants] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [audioURL, setAudioURL] = useState('');
    const [notification, setNotification] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [showQRModal, setShowQRModal] = useState(false);
    
    const [newActionText, setNewActionText] = useState('');
    const [newActionResponsible, setNewActionResponsible] = useState('');
    const [newActionDeadline, setNewActionDeadline] = useState('');
    const [newParticipantName, setNewParticipantName] = useState('');
    const [newParticipantPosition, setNewParticipantPosition] = useState('');

    const editorRef = useRef(null);
    const channelRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const recognitionRef = useRef(null);

    const showNotification = (message, type = 'success') => { setNotification({ message, type }); };

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

    useEffect(() => {
        if (!supabaseClient || !session) return;
        
        const fetchDoc = async () => {
            const { data } = await supabaseClient.from('documents').select('*').eq('id', sessionId).single();
            if (data) {
                setContent(data.content || '');
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
    
    useEffect(() => {
        if (!supabaseClient) return;
        const fetchActions = async () => {
            const { data } = await supabaseClient.from('actions').select('*').eq('doc_id', sessionId);
            if (data) setActions(data);
        };
        fetchActions();

        const subscription = supabaseClient.channel(`actions-${sessionId}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'actions', filter: `doc_id=eq.${sessionId}` }, payload => {
                if (payload.eventType === 'INSERT') {
                    setActions(current => {
                        if (current.some(a => a.id === payload.new.id)) return current;
                        return [...current, payload.new];
                    });
                }
                if (payload.eventType === 'DELETE') {
                    setActions(current => current.filter(a => a.id !== payload.old.id));
                }
            }).subscribe();
        return () => { subscription.unsubscribe(); };
    }, [sessionId]);
    
    useEffect(() => {
        if (!supabaseClient) return;
        const fetchParticipants = async () => {
            const { data } = await supabaseClient.from('participants').select('*').eq('doc_id', sessionId);
            if (data) setParticipants(data);
        };
        fetchParticipants();

        const subscription = supabaseClient.channel(`participants-${sessionId}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'participants', filter: `doc_id=eq.${sessionId}` }, payload => {
                if (payload.eventType === 'INSERT') {
                    setParticipants(current => {
                        if (current.some(p => p.id === payload.new.id)) return current;
                        return [...current, payload.new];
                    });
                }
                if (payload.eventType === 'DELETE') {
                    setParticipants(current => current.filter(p => p.id !== payload.old.id));
                }
            }).subscribe();
        return () => { subscription.unsubscribe(); };
    }, [sessionId]);

    const handleContentChange = async (newContent) => {
        setContent(newContent);
        if (isOwner) {
             await supabaseClient.from('documents').update({ content: newContent }).eq('id', sessionId);
        }
    };

    const handleMouseMove = (e) => {
        if (!userInfo || !editorRef.current || !channelRef.current) return;
        const rect = editorRef.current.getBoundingClientRect();
        const position = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        channelRef.current.send({ type: 'broadcast', event: 'cursor', payload: { name: userInfo.name, position } });
    };
    
    const addAction = async () => {
        if (newActionText.trim() && session && isOwner) {
            const newAction = { text: newActionText, responsible: newActionResponsible, deadline: newActionDeadline, user_id: session.user.id, doc_id: sessionId };
            const { data, error } = await supabaseClient.from('actions').insert(newAction).select();
            if (error) {
                console.error("Error adding action:", error);
                showNotification("No se pudo añadir la acción. Revisa los permisos de la tabla.", "error");
            } else if (data) {
                setActions(current => [...current, data[0]]);
                setNewActionText(''); setNewActionResponsible(''); setNewActionDeadline('');
                showNotification("Acción añadida correctamente.");
            }
        }
    };

    const deleteAction = async (actionId) => {
        if (!isOwner) return;
        await supabaseClient.from('actions').delete().eq('id', actionId);
    };

    const addParticipant = async () => {
        if (newParticipantName.trim() && newParticipantPosition.trim() && session && isOwner) {
            const newParticipant = { full_name: newParticipantName, position: newParticipantPosition, doc_id: sessionId };
            const { data, error } = await supabaseClient.from('participants').insert(newParticipant).select();
            if (error) {
                 console.error("Error adding participant:", error);
                 showNotification("No se pudo añadir al participante.", "error");
            } else if (data) {
                setParticipants(current => [...current, data[0]]);
                setNewParticipantName(''); setNewParticipantPosition('');
            }
        }
    };

    const deleteParticipant = async (participantId) => {
        if (!isOwner) return;
        await supabaseClient.from('participants').delete().eq('id', participantId);
    };

    const handleStartRecording = async () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) { showNotification("La transcripción no es soportada en este navegador.", "error"); return; }
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

            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = false; 
            recognitionRef.current.lang = 'es-MX';

            recognitionRef.current.onresult = (event) => {
                let transcript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        transcript += event.results[i][0].transcript;
                    }
                }
                if (transcript) {
                     setContent(prevContent => {
                        const newContent = (prevContent ? prevContent.trim() + '\n\n' : '') + transcript.trim() + '.';
                        handleContentChange(newContent); 
                        return newContent;
                    });
                }
            };
            
            recognitionRef.current.onerror = (event) => { console.error("Speech recognition error", event.error); showNotification(`Error de transcripción: ${event.error}`, "error"); };
            recognitionRef.current.start();
        } catch (err) { showNotification("No se pudo acceder al micrófono.", "error"); }
    };

    const handleStopRecording = () => { 
        if (mediaRecorderRef.current) { mediaRecorderRef.current.stop(); }
        if (recognitionRef.current) { recognitionRef.current.stop(); }
        setIsRecording(false); 
    };
    
    const handleExportPDF = () => {
        const pdfContainer = document.getElementById('pdf-container');
        const contentToPrint = `
            <div id="pdf-content">
                <h1>Minuta de Reunión</h1>
                <div class="minute-content">${content.replace(/\n/g, '<br>')}</div>
                
                <h2>Acciones Pendientes</h2>
                <div class="actions-list">
                    ${actions.length > 0 ? actions.map(a => `<div class="list-item"><strong>${a.text}</strong><br>Responsable: ${a.responsible || 'N/A'}<br>Plazo: ${a.deadline || 'N/A'}</div>`).join('') : '<p>No hay acciones pendientes.</p>'}
                </div>

                <h2>Participantes</h2>
                <div class="participants-list">
                    ${participants.length > 0 ? participants.map(p => `<div class="list-item">${p.full_name} - ${p.position}</div>`).join('') : '<p>No se registraron participantes.</p>'}
                </div>

                <div class="signatures-section">
                    <h2>Firmas</h2>
                    ${participants.map(p => `
                        <div class="signature-block">
                            <div class="signature-line"></div>
                            <div class="signature-name">${p.full_name}</div>
                            <div class="signature-position">${p.position}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        pdfContainer.innerHTML = contentToPrint;
        const element = document.getElementById('pdf-content');
        html2pdf(element, { margin: 10, filename: `minuta_${sessionId}.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } });
    };

    return (
        <div className="container mx-auto p-4 md:p-6">
            {notification && <Notification message={notification.message} type={notification.type} onClear={() => setNotification(null)} />}
            {showQRModal && <QRCodeModal sessionId={sessionId} onClose={() => setShowQRModal(false)} />}
            <header className="bg-white rounded-xl shadow-md p-4 flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-3"><i className="fas fa-users"></i> Minutería Colaborativa</h1>
                <div className="flex items-center gap-3">
                     {isOwner && <button onClick={isRecording ? handleStopRecording : handleStartRecording} className={`flex items-center gap-2 text-white font-bold py-2 px-4 rounded-lg transition-all ${isRecording ? 'bg-red-500 recording-pulse' : 'bg-gray-700 hover:bg-gray-800'}`}><i className={`fas ${isRecording ? 'fa-stop-circle' : 'fa-microphone'}`}></i>{isRecording ? 'Detener' : 'Grabar y Transcribir'}</button>}
                     {isOwner && <button onClick={() => setShowQRModal(true)} className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"><i className="fas fa-qrcode"></i>Invitar</button>}
                     {isOwner && <button onClick={handleExportPDF} className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg"><i className="fas fa-file-pdf"></i>Exportar PDF</button>}
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
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                            {actions.length > 0 ? actions.map((action) => (
                                <div key={action.id} className="bg-slate-50 p-2 rounded-md border border-slate-200 flex justify-between items-center text-sm">
                                    <div><p className="font-medium">{action.text}</p><div className="text-xs text-slate-500 flex gap-3">{action.responsible && <span><i className="fas fa-user"></i> {action.responsible}</span>}{action.deadline && <span><i className="fas fa-calendar-alt"></i> {action.deadline}</span>}</div></div>
                                    {isOwner && <button className="text-red-500 hover:text-red-700 ml-2 p-1" onClick={() => deleteAction(action.id)}><i className="fas fa-trash"></i></button>}
                                </div>
                            )) : <p className="text-sm text-slate-500 text-center">No hay acciones.</p>}
                        </div>
                    </div>
                    {isOwner && <div className="border-t pt-4">
                        <h3 className="text-lg font-semibold mb-4 text-blue-600">Añadir Acción</h3>
                        <div className="space-y-3">
                            <input type="text" value={newActionText} onChange={e => setNewActionText(e.target.value)} placeholder="Nueva acción..." className="w-full p-2 border border-slate-300 rounded-md"/>
                            <input type="text" value={newActionResponsible} onChange={e => setNewActionResponsible(e.target.value)} placeholder="Responsable..." className="w-full p-2 border border-slate-300 rounded-md"/>
                            <input type="date" value={newActionDeadline} onChange={e => setNewActionDeadline(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md"/>
                            <button className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg" onClick={addAction}><i className="fas fa-plus"></i> Añadir</button>
                        </div>
                    </div>}

                    <div className="border-t pt-4">
                        <h3 className="text-lg font-semibold mb-4 text-purple-600">Participantes (para Firma)</h3>
                        <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                            {participants.length > 0 ? participants.map((p) => (
                                <div key={p.id} className="bg-slate-50 p-2 rounded-md border border-slate-200 flex justify-between items-center text-sm">
                                    <div><p className="font-medium">{p.full_name}</p><p className="text-xs text-slate-500">{p.position}</p></div>
                                    {isOwner && <button className="text-red-500 hover:text-red-700 ml-2 p-1" onClick={() => deleteParticipant(p.id)}><i className="fas fa-trash"></i></button>}
                                </div>
                            )) : <p className="text-sm text-slate-500 text-center">No hay participantes.</p>}
                        </div>
                    </div>
                    {isOwner && <div className="border-t pt-4">
                         <h3 className="text-lg font-semibold mb-4 text-purple-600">Añadir Participante</h3>
                        <div className="space-y-3">
                            <input type="text" value={newParticipantName} onChange={e => setNewParticipantName(e.target.value)} placeholder="Nombre completo..." className="w-full p-2 border border-slate-300 rounded-md"/>
                            <input type="text" value={newParticipantPosition} onChange={e => setNewParticipantPosition(e.target.value)} placeholder="Puesto..." className="w-full p-2 border border-slate-300 rounded-md"/>
                            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg" onClick={addParticipant}><i className="fas fa-user-plus"></i> Añadir</button>
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
        try { const saved = sessionStorage.getItem('minuteriaUserInfo'); return saved ? JSON.parse(saved) : null; } catch { return null; }
    });
    const [sessionId, setSessionId] = useState(null);
    const [authError, setAuthError] = useState(null);

    useEffect(() => {
        if (!supabaseClient) return;
        
        const setupSession = async () => {
            const { data: { session } } = await supabaseClient.auth.getSession();
            if (session) { setSession(session); } 
            else {
                const { data: { session: newSession }, error } = await supabaseClient.auth.signInAnonymously();
                if (error) {
                    console.error("Error signing in anonymously:", error);
                    if (error.message.includes("Invalid API key")) {
                        setAuthError("La clave de API (anon key) de Supabase es inválida.");
                    } else if (error.message.includes("Anonymous sign-ins are disabled")) {
                        setAuthError("El inicio de sesión anónimo está deshabilitado.");
                    }
                } else { setSession(newSession); }
            }
        };
        setupSession();

        const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => { setSession(session); });
        return () => subscription.unsubscribe();
    }, []);
    
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const sessionParam = urlParams.get('session');
        if (sessionParam) { setSessionId(sessionParam); }
    }, []);
    
    useEffect(() => { document.body.classList.add('loaded'); }, []);

    const handleSetUserInfo = (name, color) => {
        const info = { name, color };
        sessionStorage.setItem('minuteriaUserInfo', JSON.stringify(info));
        setUserInfo(info);
    };

    const createNewMeeting = async () => {
        if (!session) { alert("Estableciendo sesión segura... Por favor, inténtalo de nuevo en un momento."); return; }
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
            } catch (e) { console.warn("Could not update URL via pushState. This is expected in sandboxed environments."); }
            setSessionId(newId);
        }
    };

    if (authError) { return <ErrorDisplay message={authError} isKeyError={authError.includes("inválida")} />; }
    if (!supabaseClient) { return (<div className="m-4"><div className="text-center p-8 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-lg shadow-md"><h2 className="font-bold text-xl mb-2">Configuración Incompleta</h2><p>Reemplaza las credenciales de Supabase en el código para conectar la aplicación.</p></div></div>); }
    if (!userInfo) { return <NamePicker onNameSet={handleSetUserInfo} />; }
    if (!sessionId) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-6">Minutería Colaborativa</h1>
                    <button onClick={createNewMeeting} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg"><i className="fas fa-plus mr-2"></i> Crear Nueva Minuta</button>
                </div>
            </div>
        );
    }
    return <MeetingRoom sessionId={sessionId} session={session} userInfo={userInfo} />;
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);
