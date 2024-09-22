import { useContext, useRef, useState } from "react"
import { Context, View } from "../App"
import { useSetWorldContext,} from "./WorldContext"
import { World } from "../classes/World"
import React from "react";
import {v4 as uuidv4} from 'uuid';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./ui/card";
import {Button} from './ui/Button';
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Slider } from "./ui/slider";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export type viewComponentPropType = {
    view: View,
    setView: React.Dispatch<React.SetStateAction<View>>,
}

const DEF_ALIVE_CELL_COLOR = "#D9D9D9";
const DEF_DEAD_CELL_COLOR = "#011930"

const DEF_RULES = "Any live cell with fewer than two live neighbours dies, as if by underpopulation.\n" +
    "Any live cell with two or three live neighbours lives on to the next generation.\n" +
    "Any live cell with more than three live neighbours dies, as if by overpopulation.\n" +
    "Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction."


const WorldBuilder = (props:viewComponentPropType) => {
    const updateWorld = useSetWorldContext();
    const [name, setName] = useState<string>("New World");
    const [width, setWidth] = useState<number>(10);
    const [height, setHeight] = useState<number>(10);
    //New variables
    const [initialState, setInitialState] = useState<string>("default");
    const [alivePercentage, setAlivePercentage] = useState<number>(50);
    const [aliveColor, setAliveColor] = useState<string>(DEF_ALIVE_CELL_COLOR);
    const [deadColor, setDeadColor] = useState<string>(DEF_DEAD_CELL_COLOR)
    const [rules, setRules] = useState<string>(DEF_RULES)


    const handleCreate = () => {
        const id = uuidv4();
        const today = new Date();
        const newWorld = new World(id,width, height, name, today, null, today, 0, "");
        //world = newWorld
        updateWorld(newWorld);
        props.setView(View.Player);
    }

    return (
        <React.Fragment>
          <div className="min-h-screen bg-gray-100 text-gray-900 py-8">
        <Card className="w-full max-w-6xl mx-auto bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl text-gray-800">Game of Life Setup</CardTitle>
            <CardDescription className="text-lg text-gray-600">Configure your Game of Life world</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="worldName" className="text-lg text-gray-700">World Name</Label>
                    <Input
                      id="worldName"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="text-lg bg-gray-50 border-gray-300 text-gray-900"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="width" className="text-lg text-gray-700">Width ({width})</Label>
                      <Slider
                        id="width"
                        min={10}
                        max={100}
                        step={1}
                        value={[width]}
                        onValueChange={(value) => setWidth(value[0])}
                        className="[&_[role=slider]]:bg-blue-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height" className="text-lg text-gray-700">Height ({height})</Label>
                      <Slider
                        id="height"
                        min={10}
                        max={100}
                        step={1}
                        value={[height]}
                        onValueChange={(value) => setHeight(value[0])}
                        className="[&_[role=slider]]:bg-blue-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-lg text-gray-700">Initial State</Label>
                    <RadioGroup value={initialState} onValueChange={setInitialState} className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="default" id="default" className="border-gray-400 text-blue-600" />
                        <Label htmlFor="default" className="text-base text-gray-600">Default</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="random" id="random" className="border-gray-400 text-blue-600" />
                        <Label htmlFor="random" className="text-base text-gray-600">Random</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {initialState === 'random' && (
                    <div className="space-y-2">
                      <Label htmlFor="alivePercentage" className="text-lg text-gray-700">Percentage of Alive Cells ({alivePercentage}%)</Label>
                      <Slider
                        id="alivePercentage"
                        min={1}
                        max={100}
                        step={1}
                        value={[alivePercentage]}
                        onValueChange={(value) => setAlivePercentage(value[0])}
                        className="[&_[role=slider]]:bg-blue-600"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="aliveColor" className="text-lg text-gray-700">Alive Cell Color</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="aliveColor"
                          type="color"
                          value={aliveColor}
                          onChange={(e) => setAliveColor(e.target.value)}
                          className="w-16 h-16 bg-white border-gray-300"
                        />
                        <span className="text-lg text-gray-600">{aliveColor}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deadColor" className="text-lg text-gray-700">Dead Cell Color</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="deadColor"
                          type="color"
                          value={deadColor}
                          onChange={(e) => setDeadColor(e.target.value)}
                          className="w-16 h-16 bg-white border-gray-300"
                        />
                        <span className="text-lg text-gray-600">{deadColor}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rules" className="text-lg text-gray-700">Game Rules</Label>
                  <Textarea
                    id="rules"
                    value={rules}
                    onChange={(e) => setRules(e.target.value)}
                    rows={12}
                    className="text-base h-full resize-none bg-gray-50 border-gray-300 text-gray-900"
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" onClick={()=>handleCreate()} size="lg" className="text-lg bg-blue-600 hover:bg-blue-700 text-white">Create</Button>
            <Button type="submit" onClick={(e) => props.setView(View.Menu)} size="lg" className="text-lg bg-blue-600 hover:bg-blue-700 text-white">Discard</Button>
          </CardFooter>
        </Card>
      </div>
    </React.Fragment>
    )
}
export default WorldBuilder;