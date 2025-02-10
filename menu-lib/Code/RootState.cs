namespace menu_lib.Code
{
    internal static class RootState
    {
        private static bool rootNotInitialized = true;

        public static void Init() => rootNotInitialized = true;

        public static bool IsRootInitialized()
        {
            if (rootNotInitialized)
            {
                rootNotInitialized = false;
                return true;
            }
            else
            {
                return false;
            }
        }

    }
}
