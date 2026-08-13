import { cache } from "react";
import { getStoreInfo } from "./api";

export const getStore = cache((slug: string) => getStoreInfo(slug));
