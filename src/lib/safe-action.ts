import { createSafeActionClient } from "next-safe-action";

import { auth } from "./auth";

export const action = createSafeActionClient({
  // Aqui você pode adicionar middlewares globais
  middleware: async () => {
    const session = await auth();

    if (!session?.user?.clinic?.id) {
      throw new Error("Unauthorized");
    }

    return { session };
  },
});
