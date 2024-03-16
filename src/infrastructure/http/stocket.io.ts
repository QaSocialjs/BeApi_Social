import http from "http";

import { Server, ServerOptions, Socket } from "socket.io";
import { verifyAuthentication } from "./middleware";
import { NextFunction, Request, Response } from "express";
import {
  HandleGetAllSndReqWithSpecificUser,
  HandleSendReq,
} from "../service/SockService";

const optionsConfigure: Partial<ServerOptions> = {
  cors: {
    origin: "*",
  },
};

export const wrapper =
  (
    expressMiddleware: (req: Request, res: Response, next: NextFunction) => void
  ) =>
  (socket: Socket, next: () => void) => {
    return expressMiddleware(
      socket.request as unknown as Request,
      {} as Response,
      next
    );
  };

const socketIO = (server: http.Server) => {
  const io = new Server(server, optionsConfigure);
  let users: Record<string, { socketID: string }[]> = {};
  io.on("connection", (socket) => {
    socket.on("connected", (e) => {
      console.log("stock Id" + socket.id + "and userId" + e.id);
      if (!users[e.id]) {
        users[e.id] = [{ socketID: socket.id }];
      } else {
        users[e.id].push({ socketID: socket.id });
      }
    });
    socket.on("makeFriend", async ({ id, idFr }) => {
      try {
        await HandleSendReq(id, idFr, socket);
        await HandleGetAllSndReqWithSpecificUser(idFr, users, socket);
      } catch (error) {
        console.error("Error making friend:", error);
        socket.emit("Some thing is wrong");
      }
    });
  });
};

export default socketIO;
