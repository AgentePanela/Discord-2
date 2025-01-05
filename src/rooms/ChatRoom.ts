import { Room, Client } from "@colyseus/core";
import { MyRoomState } from "./schema/MyRoomState";

export interface message {
  id: number;
  author: string;
  message: string;
  date: number;
}

export class ChatRoom extends Room<MyRoomState> {
  maxClients = 15;

  connectedClients: { [id: string]: any } = {};

  messages: message[] = [] //fuck schema

  onCreate (options: any) {
    //this.setState(new MyRoomState());
    this.autoDispose = false;
    this.roomId = "ChatRoom"

    const sendMessage = (author: string, message: string) => {
      const newMessage: message = {
        id: this.messages.length,
        author: author,
        message: message,
        date: Date.now()
      }

      this.messages.push(newMessage);
      this.broadcast("chat", newMessage);
    }

    this.onMessage("chat", (client, message) => {
      if(!message)
        return;

      sendMessage(this.connectedClients[client.sessionId]["username"], message)
      console.log(`${this.connectedClients[client.sessionId]["username"]} has sent "${message}"`)
      //this.broadcast("chat", `${this.connectedClients[client.sessionId]}: ${message}`)
    });
  }

  onJoin (client: Client, options: any) {
    console.log(options["username"], "joined!");

    /*
    if(!options["username"]) {//kick client if theres no username
      client.leave(1001, "No username provided");
      console.log(`Kicking client ${client.sessionId}, reason: "No username provided".`);
    }*/

    this.connectedClients[client.sessionId] = options;
    if(!options["username"])
      this.connectedClients[client.sessionId]["username"] = `User - ${Math.floor(Math.random() * 100)}`;

    client.send("messageLog", this.messages);
    this.broadcast("Broadcast", `${this.connectedClients[client.sessionId]["username"]} has joined!`);
  }

  onLeave (client: Client, consented: boolean) {
    console.log(this.connectedClients[client.sessionId]["username"], "left!");
    this.broadcast("Broadcast", `${this.connectedClients[client.sessionId]["username"]} has leave!`);
    delete this.connectedClients[client.sessionId];
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
