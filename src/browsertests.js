// Browser A
const fanA = new WebSocket("ws://localhost:8000/ws");

fanA.onmessage = (e) => {
   const msg = JSON.parse(e.data);
   console.log("%c[Fan A - Match 1 Only]", "color: #00ff00; font-weight: bold", msg);
};

fanA.onopen = () => {
  // We send the subscription command for Match ID 1
   fanA.send(JSON.stringify({ type: "subscribe", matchId: 1 }));
   console.log("Fan A subscribed to Match 1");
};

// Browser B
const fanB = new WebSocket("ws://localhost:8000/ws");

fanB.onmessage = (e) => {
   const msg = JSON.parse(e.data);
   console.log("%c[Fan B - Match 2 Only]", "color: #3498db; font-weight: bold", msg);
};

fanB.onopen = () => {
  // We send the subscription command for Match ID 2
   fanB.send(JSON.stringify({ type: "subscribe", matchId: 2 }));
   console.log("Fan B subscribed to Match 2");
};

// Browser C
const lurker = new WebSocket("ws://localhost:8000/ws");
// This user just connects. They DO NOT send a "subscribe" message.
lurker.onmessage = (e) => console.log("%c[Tab 3 - Lurker]", "color: #95a5a6; font-weight: bold", JSON.parse(e.data));
lurker.onopen = () => console.log("Lurker connected to the Lobby.");