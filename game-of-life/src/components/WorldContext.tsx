import { ReactNode, createContext, useContext, useState, Provider, useRef } from "react";
import { World } from "../classes/World";

// Define the context
export const WorldContext = createContext<World | null>(null);
export const UpdateWorldContext = createContext<any>(null);

// Define a custom hook to access the world context
export const useWorldContext = () => {
    const context = useContext(WorldContext);
    if (context === null) {
      throw new Error("useWorldClass must be used within a WorldProvider");
    }
    return context;
  };

export const useSetWorldContext = () => useContext(UpdateWorldContext);

// Define the context provider
export const WorldProvider = ({ children }: { children: ReactNode }) => {
    const worldRef = useRef<World | null>(null);

    const updateWorld = (newWorld:World/*updatedFields: Partial<World>*/) => {
        worldRef.current = newWorld;
        /*setWorld(newWorld);
        setWorld((prevWorld) => {
            if (prevWorld === null) {
                return new World(
                    updatedFields.id,
                    updatedFields.columns,
                    updatedFields.rows,
                    updatedFields.name,
                    updatedFields.created,
                    updatedFields.cells,
                    updatedFields.lastUpdate ?? new Date(),  // Set lastUpdate or default to current date
                    updatedFields.generation ?? 0,           // Set generation or default to 0
                    updatedFields.image ?? ""           // Optional other field
                  );// Handle the case where world is null initially
            }
            // Create a new World instance with updated fields
            const newWorld = new World(
              updatedFields.id ?? prevWorld.id,                  // Update the ID if provided
              updatedFields.columns ?? prevWorld.columns,        // Update columns if provided
              updatedFields.rows ?? prevWorld.rows,              // Update rows if provided
              updatedFields.name ?? prevWorld.name,              // Update name if provided
              updatedFields.created ?? prevWorld.created,        // Update creation date if provided
              updatedFields.cells ?? prevWorld.cells,            // Update cells if provided
              updatedFields.lastUpdate ?? prevWorld.lastUpdate,  // Update lastUpdate if provided
              updatedFields.generation ?? prevWorld.generation,  // Update generation if provided
              updatedFields.image?? prevWorld.image   // Update otherField if provided
            );
      
            return newWorld;
        });*/
    }

    
    return (
        <WorldContext.Provider value={worldRef.current}>
            <UpdateWorldContext.Provider value={updateWorld}>
                {children}
            </UpdateWorldContext.Provider>
        </WorldContext.Provider>
    );
};