import { ReactNode, createContext, useContext, useState, Provider } from "react";
import { World } from "../classes/World";
/*interface WorldProviderProps {
    children: ReactNode;
  }

  // Define context type
interface WorldContextType {
    world: World | null;
    setWorld: (world: World | null) => void;
}
const WorldContext = createContext<World | null>(null);

export const useWorldContext = () => useContext(WorldContext);

export const WorldProvider = ({children}: WorldProviderProps) => {
    /*const [world,setWorld] = useState<World | null>(null);
   
    return (
        <WorldContext.Provider value={[world, setWorld]}>
            {children}
        </WorldContext.Provider>
    )
} */
// Define the context
export const WorldContext = createContext<World | null>(null);
export const UpdateWorldContext = createContext<any>(null);

// Define a custom hook to access the world context
export const useWorldContext = () => useContext(WorldContext);

export const useSetWorldContext = () => useContext(UpdateWorldContext);

// Define the context provider
export const WorldProvider = ({ children }: { children: ReactNode }) => {
    const [world, setWorld] = useState<World | null>(null);

    const updateWorld = (world:World, callback?:()=> void) => {
        setWorld(world);
    }

    
    return (
        <WorldContext.Provider value={world}>
            <UpdateWorldContext.Provider value={updateWorld}>
                {children}
            </UpdateWorldContext.Provider>
        </WorldContext.Provider>
    );
};