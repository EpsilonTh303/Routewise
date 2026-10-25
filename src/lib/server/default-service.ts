import { db } from "../db";
import { CatalogRepository } from "./catalog";
import { RouteWiseService } from "./service";

export const service = new RouteWiseService(new CatalogRepository(db));
