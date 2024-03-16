import { notificationRepo } from "../../../notifications/repo";
import { GetNotificationUseCase } from "./GetNotificationUseCase";

const getNotificationUseCase = new GetNotificationUseCase(notificationRepo);

export { getNotificationUseCase };
