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
    return React.createElement(
        'div',
        { className: 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50' },
        React.createElement(
            'div',
            { className: 'm-4 max-w-lg' },
            React.createElement(
                'div',
                { className: 'text-center p-8 bg-white rounded-lg shadow-xl' },
                React.createElement(
                    'h2',
                    { className: 'font-bold text-2xl text-red-600 mb-4' },
                    React.createElement('i', { className: 'fas fa-exclamation-triangle mr-2' }),
                    'Error de Configuración'
                ),
                React.createElement(
                    'p',
                    { className: 'text-slate-700 text-left mb-4' },
                    'La aplicación no puede iniciar debido a un problema con la configuración de Supabase.'
                ),
                React.createElement(
                    'div',
                    { className: 'text-left p-4 bg-red-50 border border-red-200 rounded-md' },
                    React.createElement(
                        'p',
                        { className: 'font-semibold text-red-800' },
                        'Error: ',
                        message
                    )
                ),
                React.createElement(
                    'p',
                    { className: 'text-slate-700 text-left mt-4 mb-6' },
                    isKeyError 
                        ? "Por favor, verifica que la 'URL' y la 'Clave Pública (anon key)' en el código sean correctas. Puedes obtenerlas desde el panel de tu proyecto en Supabase."
                        : "Para solucionarlo, por favor activa el inicio de sesión anónimo en tu panel de control de Supabase (Authentication -> Providers)."
                ),
                React.createElement(
                    'a',
                    {
                        href: 'https://supabase.com/dashboard',
                        target: '_blank',
                        rel: 'noopener noreferrer',
                        className: 'inline-block w-full bg-red-500 text-white font-bold py-3 px-4 rounded hover:bg-red-600 transition-colors'
                    },
                    React.createElement('i', { className: 'fas fa-external-link-alt mr-2' }),
                    ' Ir al panel de Supabase'
                )
            )
        )
    );
}

function Notification({ message, type, onClear }) {
    useEffect(() => {
        const timer = setTimeout(() => { onClear(); }, 3000);
        return () => clearTimeout(timer);
    }, [onClear]);
    
    const baseClasses = "fixed bottom-5 right-5 p-4 rounded-lg shadow-lg text-white z-50 notification";
    const typeClasses = type === 'error' ? 'bg-red-500' : 'bg-green-500';
    
    return React.createElement(
        'div',
        { className: `${baseClasses} ${typeClasses}` },
        React.createElement('i', { className: `fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'} mr-2` }),
        message
    );
}

function NamePicker({ onNameSet }) {
    const [name, setName] = useState('');
    const [position, setPosition] = useState('');
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFA1'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim() && position.trim()) {
            onNameSet(name.trim(), position.trim(), randomColor);
        }
    };
    
    return React.createElement(
        'div',
        { className: 'fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50' },
        React.createElement(
            'div',
            { className: 'bg-white rounded-lg shadow-xl p-8 text-center w-full max-w-sm' },
            React.createElement(
                'h2',
                { className: 'text-2xl font-bold mb-4' },
                '¡Bienvenido/a!'
            ),
            React.createElement(
                'p',
                { className: 'text-slate-600 mb-6' },
                'Identifícate para unirte a la sesión.'
            ),
            React.createElement(
                'form',
                { onSubmit: handleSubmit, className: 'space-y-4' },
                React.createElement('input', {
                    type: 'text',
                    value: name,
                    onChange: (e) => setName(e.target.value),
                    placeholder: 'Tu nombre completo...',
                    className: 'w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500',
                    required: true
                }),
                React.createElement('input', {
                    type: 'text',
                    value: position,
                    onChange: (e) => setPosition(e.target.value),
                    placeholder: 'Tu puesto o cargo...',
                    className: 'w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500',
                    required: true
                }),
                React.createElement(
                    'button',
                    {
                        type: 'submit',
                        className: 'w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 transition'
                    },
                    'Unirse a la sesión'
                )
            )
        )
    );
}

function Cursor({ user }) {
    if (!user || !user.position) return null;
    
    return React.createElement(
        'div',
        {
            className: 'cursor',
            style: { left: `${user.position.x}px`, top: `${user.position.y}px`, color: user.color },
            'data-user': user.name
        },
        React.createElement('i', {
            className: 'fas fa-mouse-pointer',
            style: { transform: 'rotate(-10deg)', fontSize: '20px' }
        })
    );
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

    return React.createElement(
        'div',
        { className: 'fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50', onClick: onClose },
        React.createElement(
            'div',
            { className: 'bg-white rounded-lg shadow-xl p-8 text-center', onClick: (e) => e.stopPropagation() },
            React.createElement(
                'h2',
                { className: 'text-2xl font-bold mb-4' },
                'Invita a Participantes'
            ),
            React.createElement(
                'p',
                { className: 'text-slate-600 mb-6' },
                'Escanea el código para unirte o descárgalo para compartir.'
            ),
            React.createElement('div', { ref: qrRef, className: 'inline-block' }),
            React.createElement(
                'div',
                { className: 'mt-6 flex flex-col sm:flex-row gap-4' },
                React.createElement(
                    'button',
                    {
                        onClick: handleDownload,
                        className: 'flex-1 bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2'
                    },
                    React.createElement('i', { className: 'fas fa-download' }),
                    ' Descargar QR'
                ),
                React.createElement(
                    'button',
                    {
                        onClick: onClose,
                        className: 'flex-1 bg-slate-200 text-slate-700 font-bold py-2 rounded-md hover:bg-slate-300 transition'
                    },
                    'Cerrar'
                )
            )
        )
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
    
    const editorRef = useRef(null);
    const channelRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const recognitionRef = useRef(null);
    const lastTranscriptTime = useRef(Date.now());

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
    };

    useEffect(() => {
        if (!session || !userInfo || !supabaseClient) return;

        const channel = supabaseClient.channel(`room-${sessionId}`, { config: { presence: { key: userInfo.name } } });
        
        channel.on('presence', { event: 'sync' }, () => {
            const presenceState = channel.presenceState();
            const activeUsers = {};
            for (const key in presenceState) {
                activeUsers[key] = presenceState[key][0];
            }
            setUsers(activeUsers);
        });

        channel.on('broadcast', { event: 'cursor' }, ({ payload }) => {
            setUsers(prev => ({ ...prev, [payload.name]: { ...prev[payload.name], position: payload.position } }));
        });

        channel.on('broadcast', { event: 'transcription' }, ({ payload }) => {
            setContent(prev => prev + payload.transcript);
        });

        channel.subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
                await channel.track(userInfo);
            }
        });
        
        channelRef.current = channel;
        return () => { channel.unsubscribe(); };
    }, [session, userInfo, sessionId]);

    useEffect(() => {
        if (!supabaseClient || !session) return;
        
        const fetchInitialData = async () => {
            const { data: docData } = await supabaseClient.from('documents').select('*').eq('id', sessionId).single();
            if (docData) {
                setContent(docData.content || '');
                setIsOwner(docData.owner_id === session.user.id);
            }
            
            const { data: actionsData } = await supabaseClient.from('actions').select('*').eq('doc_id', sessionId);
            if (actionsData) setActions(actionsData);
            
            const { data: participantsData } = await supabaseClient.from('participants').select('*').eq('doc_id', sessionId).order('ordering', { ascending: true });
            if (participantsData) setParticipants(participantsData);
        };
        
        fetchInitialData();

        const docSubscription = supabaseClient.channel(`documents-${sessionId}`).on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'documents', filter: `id=eq.${sessionId}` }, payload => { setContent(payload.new.content); }).subscribe();
        const actionsSubscription = supabaseClient.channel(`actions-${sessionId}`).on('postgres_changes', { event: '*', schema: 'public', table: 'actions', filter: `doc_id=eq.${sessionId}` }, async () => { const { data } = await supabaseClient.from('actions').select('*').eq('doc_id', sessionId); if (data) setActions(data); }).subscribe();
        const participantsSubscription = supabaseClient.channel(`participants-${sessionId}`).on('postgres_changes', { event: '*', schema: 'public', table: 'participants', filter: `doc_id=eq.${sessionId}` }, async () => { const { data } = await supabaseClient.from('participants').select('*').eq('doc_id', sessionId).order('ordering', { ascending: true }); if (data) setParticipants(data); }).subscribe();

        return () => {
            docSubscription.unsubscribe();
            actionsSubscription.unsubscribe();
            participantsSubscription.unsubscribe();
        };
    }, [sessionId, session]);

    // Auto-register participant
    useEffect(() => {
        if(session && userInfo.name && userInfo.position && sessionId) {
            const addParticipantToDb = async () => {
                // Check if user is already a participant to avoid duplicates
                const { data, count } = await supabaseClient.from('participants').select('*', { count: 'exact' }).eq('doc_id', sessionId).eq('user_id', session.user.id);
                if (count === 0) {
                    await supabaseClient.from('participants').insert({
                        doc_id: sessionId,
                        user_id: session.user.id,
                        full_name: userInfo.name,
                        position: userInfo.position,
                    });
                }
            };
            addParticipantToDb();
        }
    }, [session, userInfo, sessionId]);

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

    const addAction = async (newAction) => {
        if (isOwner) {
            const { error } = await supabaseClient.from('actions').insert(newAction);
            if (error) showNotification("No se pudo añadir la acción.", "error");
            else showNotification("Acción añadida.");
        }
    };
    
    const deleteAction = async (actionId) => {
        if (isOwner) await supabaseClient.from('actions').delete().eq('id', actionId);
    };

    const deleteParticipant = async (participantId) => {
        if (isOwner) await supabaseClient.from('participants').delete().eq('id', participantId);
    };

    const handleMoveParticipant = async (participantId, direction) => {
        const currentIndex = participants.findIndex(p => p.id === participantId);
        if ((direction === 'up' && currentIndex === 0) || (direction === 'down' && currentIndex === participants.length - 1)) return;
        
        const otherIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        const currentParticipant = participants[currentIndex];
        const otherParticipant = participants[otherIndex];

        // Swap ordering values
        await supabaseClient.from('participants').update({ ordering: otherParticipant.ordering }).eq('id', currentParticipant.id);
        await supabaseClient.from('participants').update({ ordering: currentParticipant.ordering }).eq('id', otherParticipant.id);
    };

    const handleStartRecording = async () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) { showNotification("La transcripción no es soportada.", "error"); return; }
        if (!navigator.mediaDevices?.getUserMedia) { showNotification("Grabación no soportada.", "error"); return; }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setIsRecording(true);
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.start();
            audioChunksRef.current = [];
            mediaRecorderRef.current.ondataavailable = e => audioChunksRef.current.push(e.data);
            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                setAudioURL(URL.createObjectURL(audioBlob));
                stream.getTracks().forEach(track => track.stop());
            };

            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'es-MX';
            
            let finalTranscript = '';
            recognitionRef.current.onresult = (event) => {
    let interimTranscript = '';
    let finalTranscript = '';
    
    for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
        } else {
            interimTranscript += event.results[i][0].transcript;
        }
    }

    // Actualizar el estado local del host inmediatamente
    if (finalTranscript) {
        setContent(prev => prev + finalTranscript);
        
        // Guardar en la base de datos si es el host
        if (isOwner) {
            handleContentChange(content + finalTranscript);
        }
        
        // Enviar a otros participantes
        if (channelRef.current) {
            channelRef.current.send({ 
                type: 'broadcast', 
                event: 'transcription', 
                payload: { transcript: finalTranscript } 
            });
        }
    }
};
            
            recognitionRef.current.onend = () => {
                // Save final content to DB when recognition stops
                if (isOwner) {
                    handleContentChange(content + finalTranscript);
                }
            };

            recognitionRef.current.onerror = (e) => {
                console.error(e);
                showNotification(`Error de transcripción: ${e.error}`, "error");
            };
            
            recognitionRef.current.start();
        } catch (err) {
            showNotification("No se pudo acceder al micrófono.", "error");
        }
    };

    const handleStopRecording = () => { 
        if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
        if (recognitionRef.current) recognitionRef.current.stop();
        setIsRecording(false);
    };
    
    const handleExportPDF = () => {
        const pdfContainer = document.getElementById('pdf-container');
        const contentToPrint = `<div id="pdf-content"><h1>Minuta de Reunión</h1><div class="minute-content">${content.replace(/\n/g, '<br>')}</div><h2>Acciones Pendientes</h2><div class="actions-list">${actions.length > 0 ? actions.map(a => `<div class="list-item"><strong>${a.text}</strong><br>Responsable: ${a.responsible || 'N/A'}<br>Plazo: ${a.deadline || 'N/A'}</div>`).join('') : '<p>No hay acciones.</p>'}</div><h2>Participantes</h2><div class="participants-list">${participants.length > 0 ? participants.map(p => `<div class="list-item">${p.full_name} - ${p.position}</div>`).join('') : '<p>No se registraron.</p>'}</div><div class="signatures-section"><h2>Firmas</h2>${participants.map(p => `<div class="signature-block"><div class="signature-line"></div><div class="signature-name">${p.full_name}</div><div class="signature-position">${p.position}</div></div>`).join('')}</div></div>`;
        pdfContainer.innerHTML = contentToPrint;
        const element = document.getElementById('pdf-content');
        html2pdf(element, { margin: 10, filename: `minuta_${sessionId}.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }, pagebreak: { mode: ['avoid-all', 'css', 'legacy'] } });
    };

    const ActionPanel = ({ isOwner }) => {
        const [text, setText] = useState('');
        const [responsible, setResponsible] = useState('');
        const [deadline, setDeadline] = useState('');

        const handleAdd = () => {
            if (text.trim()) {
                addAction({ doc_id: sessionId, user_id: session.user.id, text, responsible, deadline });
                setText(''); setResponsible(''); setDeadline('');
            }
        };

        return React.createElement(
            'div',
            { className: 'border-t pt-4' },
            React.createElement(
                'h3',
                { className: 'text-lg font-semibold mb-4 text-blue-600' },
                'Añadir Acción'
            ),
            React.createElement(
                'div',
                { className: 'space-y-3' },
                React.createElement('input', {
                    type: 'text',
                    value: text,
                    onChange: e => setText(e.target.value),
                    placeholder: 'Nueva acción...',
                    className: 'w-full p-2 border border-slate-300 rounded-md'
                }),
                React.createElement('input', {
                    type: 'text',
                    value: responsible,
                    onChange: e => setResponsible(e.target.value),
                    placeholder: 'Responsable...',
                    className: 'w-full p-2 border border-slate-300 rounded-md'
                }),
                React.createElement('input', {
                    type: 'date',
                    value: deadline,
                    onChange: e => setDeadline(e.target.value),
                    className: 'w-full p-2 border border-slate-300 rounded-md'
                }),
                React.createElement(
                    'button',
                    {
                        className: 'w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg',
                        onClick: handleAdd
                    },
                    React.createElement('i', { className: 'fas fa-plus' }),
                    ' Añadir'
                )
            )
        );
    };

    return React.createElement(
        'div',
        { className: 'container mx-auto p-4 md:p-6' },
        notification && React.createElement(Notification, {
            message: notification.message,
            type: notification.type,
            onClear: () => setNotification(null)
        }),
        showQRModal && React.createElement(QRCodeModal, {
            sessionId: sessionId,
            onClose: () => setShowQRModal(false)
        }),
        React.createElement(
            'header',
            { className: 'bg-white rounded-xl shadow-md p-4 flex justify-between items-center mb-6' },
            React.createElement(
                'h1',
                { className: 'text-2xl font-bold text-blue-600 flex items-center gap-3' },
                React.createElement('i', { className: 'fas fa-users' }),
                ' Minutería Colaborativa'
            ),
            React.createElement(
                'div',
                { className: 'flex items-center gap-3' },
                isOwner && React.createElement(
                    'button',
                    {
                        onClick: isRecording ? handleStopRecording : handleStartRecording,
                        className: `flex items-center gap-2 text-white font-bold py-2 px-4 rounded-lg transition-all ${isRecording ? 'bg-red-500 recording-pulse' : 'bg-gray-700 hover:bg-gray-800'}`
                    },
                    React.createElement('i', { className: `fas ${isRecording ? 'fa-stop-circle' : 'fa-microphone'}` }),
                    isRecording ? 'Detener' : 'Grabar y Transcribir'
                ),
                isOwner && React.createElement(
                    'button',
                    {
                        onClick: () => setShowQRModal(true),
                        className: 'flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg'
                    },
                    React.createElement('i', { className: 'fas fa-qrcode' }),
                    'Invitar'
                ),
                isOwner && React.createElement(
                    'button',
                    {
                        onClick: handleExportPDF,
                        className: 'flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg'
                    },
                    React.createElement('i', { className: 'fas fa-file-pdf' }),
                    'Exportar PDF'
                ),
                React.createElement(
                    'span',
                    { className: 'text-sm text-slate-600 hidden sm:inline' },
                    'Online:'
                ),
                React.createElement(
                    'div',
                    { className: 'flex -space-x-2' },
                    Object.entries(users).map(([key, u]) => (u && u.name && 
                        React.createElement(
                            'div',
                            {
                                key: key,
                                className: 'w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white font-bold',
                                style: { backgroundColor: u.color },
                                title: u.name
                            },
                            u.name.charAt(0)
                        )
                    ))
                )
            )
        ),
        
        React.createElement(
            'div',
            { className: 'grid grid-cols-1 lg:grid-cols-3 gap-6' },
            React.createElement(
                'div',
                { className: 'lg:col-span-2 space-y-6' },
                React.createElement(
                    'div',
                    { className: 'bg-white rounded-xl shadow-md overflow-hidden' },
                    React.createElement(
                        'div',
                        { className: 'p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center' },
                        React.createElement(
                            'div',
                            null,
                            React.createElement(
                                'h2',
                                { className: 'text-lg font-semibold' },
                                'Reunión de Sincronización'
                            ),
                            React.createElement(
                                'p',
                                { className: 'text-sm text-slate-500' },
                                'ID de Sesión: ',
                                sessionId
                            )
                        ),
                        isRecording && React.createElement(
                            'div',
                            { className: 'text-sm text-red-500 font-semibold animate-pulse' },
                            'Transcripción en curso...'
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'relative min-h-[500px] p-4', ref: editorRef, onMouseMove: handleMouseMove },
                        Object.entries(users).map(([key, u]) => (u && u.name !== userInfo.name) ? 
                            React.createElement(Cursor, { key: key, user: u }) : null
                        ),
                        React.createElement('textarea', {
                            readOnly: !isOwner || isRecording,
                            className: `w-full h-full absolute top-0 left-0 p-4 bg-transparent resize-none outline-none text-base leading-relaxed text-slate-800 ${!isOwner || isRecording ? 'cursor-not-allowed' : ''}`,
                            style: { minHeight: '500px' },
                            value: content,
                            onChange: (e) => handleContentChange(e.target.value)
                        })
                    )
                ),
                audioURL && React.createElement(
                    'div',
                    { className: 'bg-white rounded-xl shadow-md p-4' },
                    React.createElement(
                        'h3',
                        { className: 'text-md font-semibold mb-2 text-slate-700' },
                        'Grabación de Audio'
                    ),
                    React.createElement('audio', { src: audioURL, controls: true, className: 'w-full' })
                )
            ),
            
            React.createElement(
                'div',
                { className: 'bg-white rounded-xl shadow-md p-5 space-y-4' },
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'h3',
                        { className: 'text-lg font-semibold mb-4 text-blue-600' },
                        'Acciones Pendientes'
                    ),
                    React.createElement(
                        'div',
                        { className: 'space-y-3 max-h-60 overflow-y-auto pr-2' },
                        actions.length > 0 ? actions.map((action) => 
                            React.createElement(
                                'div',
                                { key: action.id, className: 'bg-slate-50 p-2 rounded-md border border-slate-200 flex justify-between items-center text-sm' },
                                React.createElement(
                                    'div',
                                    null,
                                    React.createElement('p', { className: 'font-medium' }, action.text),
                                    React.createElement(
                                        'div',
                                        { className: 'text-xs text-slate-500 flex gap-3' },
                                        action.responsible && React.createElement(
                                            'span',
                                            null,
                                            React.createElement('i', { className: 'fas fa-user' }),
                                            ' ',
                                            action.responsible
                                        ),
                                        action.deadline && React.createElement(
                                            'span',
                                            null,
                                            React.createElement('i', { className: 'fas fa-calendar-alt' }),
                                            ' ',
                                            action.deadline
                                        )
                                    )
                                ),
                                isOwner && React.createElement(
                                    'button',
                                    {
                                        className: 'text-red-500 hover:text-red-700 ml-2 p-1',
                                        onClick: () => deleteAction(action.id)
                                    },
                                    React.createElement('i', { className: 'fas fa-trash' })
                                )
                            )
                        ) : React.createElement(
                            'p',
                            { className: 'text-sm text-slate-500 text-center' },
                            'No hay acciones.'
                        )
                    )
                ),
                isOwner && React.createElement(ActionPanel, { isOwner: isOwner }),
                React.createElement(
                    'div',
                    { className: 'border-t pt-4' },
                    React.createElement(
                        'h3',
                        { className: 'text-lg font-semibold mb-4 text-purple-600' },
                        'Participantes (para Firma)'
                    ),
                    React.createElement(
                        'div',
                        { className: 'space-y-3 max-h-48 overflow-y-auto pr-2' },
                        participants.length > 0 ? participants.map((p, index) => 
                            React.createElement(
                                'div',
                                { key: p.id, className: 'bg-slate-50 p-2 rounded-md border border-slate-200 flex justify-between items-center text-sm' },
                                React.createElement(
                                    'div',
                                    null,
                                    React.createElement('p', { className: 'font-medium' }, p.full_name),
                                    React.createElement('p', { className: 'text-xs text-slate-500' }, p.position)
                                ),
                                isOwner && React.createElement(
                                    'div',
                                    { className: 'flex gap-2' },
                                    React.createElement(
                                        'button',
                                        {
                                            disabled: index === 0,
                                            onClick: () => handleMoveParticipant(p.id, 'up'),
                                            className: 'text-gray-500 hover:text-gray-800 disabled:opacity-25'
                                        },
                                        React.createElement('i', { className: 'fas fa-arrow-up' })
                                    ),
                                    React.createElement(
                                        'button',
                                        {
                                            disabled: index === participants.length - 1,
                                            onClick: () => handleMoveParticipant(p.id, 'down'),
                                            className: 'text-gray-500 hover:text-gray-800 disabled:opacity-25'
                                        },
                                        React.createElement('i', { className: 'fas fa-arrow-down' })
                                    ),
                                    React.createElement(
                                        'button',
                                        {
                                            className: 'text-red-500 hover:text-red-700 ml-2 p-1',
                                            onClick: () => deleteParticipant(p.id)
                                        },
                                        React.createElement('i', { className: 'fas fa-trash' })
                                    )
                                )
                            )
                        ) : React.createElement(
                            'p',
                            { className: 'text-sm text-slate-500 text-center' },
                            'No hay participantes.'
                        )
                    )
                )
            )
        )
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
                    if (error.message.includes("Invalid API key")) {
                        setAuthError("La clave de API (anon key) de Supabase es inválida.");
                    } else if (error.message.includes("Anonymous sign-ins are disabled")) {
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
    
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const sessionParam = urlParams.get('session');
        if (sessionParam) {
            setSessionId(sessionParam);
        }
    }, []);
    
    useEffect(() => {
        document.body.classList.add('loaded');
    }, []);

    const handleSetUserInfo = (name, position, color) => {
        const info = { name, position, color };
        sessionStorage.setItem('minuteriaUserInfo', JSON.stringify(info));
        setUserInfo(info);
    };

    const createNewMeeting = async () => {
        if (!session) {
            alert("Estableciendo sesión segura... Por favor, inténtalo de nuevo en un momento.");
            return;
        }
        
        const newId = Math.random().toString(36).substring(2, 10);
        const { error } = await supabaseClient.from('documents').insert({
            id: newId,
            content: `## Minuta de Reunión - ${new Date().toLocaleDateString()}\n\n- Escribe aquí para empezar.`,
            owner_id: session.user.id
        });
        
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
        return React.createElement(ErrorDisplay, {
            message: authError,
            isKeyError: authError.includes("inválida")
        });
    }
    
    if (!supabaseClient) {
        return React.createElement(
            'div',
            { className: 'm-4' },
            React.createElement(
                'div',
                { className: 'text-center p-8 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-lg shadow-md' },
                React.createElement(
                    'h2',
                    { className: 'font-bold text-xl mb-2' },
                    'Configuración Incompleta'
                ),
                React.createElement(
                    'p',
                    null,
                    'Reemplaza las credenciales de Supabase en el código para conectar la aplicación.'
                )
            )
        );
    }
    
    if (!userInfo) {
        return React.createElement(NamePicker, { onNameSet: handleSetUserInfo });
    }
    
    if (!sessionId) {
        return React.createElement(
            'div',
            { className: 'flex items-center justify-center h-screen' },
            React.createElement(
                'div',
                { className: 'text-center' },
                React.createElement(
                    'h1',
                    { className: 'text-4xl font-bold mb-6' },
                    'Minutería Colaborativa'
                ),
                React.createElement(
                    'button',
                    {
                        onClick: createNewMeeting,
                        className: 'bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg'
                    },
                    React.createElement('i', { className: 'fas fa-plus mr-2' }),
                    ' Crear Nueva Minuta'
                )
            )
        );
    }
    
    return React.createElement(MeetingRoom, {
        sessionId: sessionId,
        session: session,
        userInfo: userInfo
    });
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(React.createElement(App));
