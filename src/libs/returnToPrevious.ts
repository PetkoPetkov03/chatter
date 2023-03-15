import type { NextRouter } from "next/router";

export const returnToPrevious = (router: NextRouter) => {
    return router.back();
}