import { ReactNode, createContext, useContext, useState, Provider } from "react";
import { World } from "../classes/World";

interface WorldProviderProps {
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
    )*/
} 
