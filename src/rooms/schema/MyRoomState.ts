import { Schema, Context, type, MapSchema } from "@colyseus/schema";

export class MyRoomState extends Schema {

  @type("string") mySynchronizedProperty: string = "Hello world";
  //todo: message log to schema
}
