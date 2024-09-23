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

    const updateWorld = (updatedFields: Partial<World>) => {
        if (worldRef.current === null) {
            worldRef.current = new World(
                updatedFields.id,
                updatedFields.columns,
                updatedFields.rows,
                updatedFields.name,
                updatedFields.created,
                updatedFields.cells,
                updatedFields.lastUpdate ?? new Date(),  // Set lastUpdate or default to current date
                updatedFields.generations ?? 0,           // Set generation or default to 0
                updatedFields.image ?? ""           // Optional other field
              );// Handle the case where world is null initially
        } else {
            // Update only fields that are provided
            worldRef.current.id = updatedFields.id ?? worldRef.current.id;
            worldRef.current.columns = updatedFields.columns ?? worldRef.current.columns;
            worldRef.current.rows = updatedFields.rows ?? worldRef.current.rows;
            worldRef.current.name = updatedFields.name ?? worldRef.current.name;
            worldRef.current.created = updatedFields.created ?? worldRef.current.created;
            worldRef.current.cells = updatedFields.cells ?? worldRef.current.cells;
            worldRef.current.lastUpdate = updatedFields.lastUpdate ?? updatedFields.lastUpdate;  // Default to current date
            worldRef.current.generations = updatedFields.generations ?? worldRef.current.generations; // Update or keep existing
            worldRef.current.image = updatedFields.image ?? worldRef.current.image; // Update or keep existing
     
        }

    }

    
    return (
        <WorldContext.Provider value={worldRef.current}>
            <UpdateWorldContext.Provider value={updateWorld}>
                {children}
            </UpdateWorldContext.Provider>
        </WorldContext.Provider>
    );
};