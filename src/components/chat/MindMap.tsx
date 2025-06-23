import React, { useMemo } from 'react';
import { ReactFlow, Background, Controls, MiniMap, Node, Edge, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import { Stack } from '@/hooks/useAutonomousAgent';
import CustomNode from './CustomNode';

interface MindMapProps {
  stack: Stack;
}

const nodeTypes = {
  custom: CustomNode,
};

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 200;
const nodeHeight = 70;

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  dagreGraph.setGraph({ rankdir: 'LR' });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = Position.Left;
    node.sourcePosition = Position.Right;
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};


export const MindMap: React.FC<MindMapProps> = ({ stack }) => {

  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
    const initialNodes: Node[] = stack.components.map((component) => ({
      id: component.name,
      type: 'custom',
      data: { component },
      position: { x: 0, y: 0 }, // Initial position, will be updated by layout
    }));
  
    const initialEdges: Edge[] = stack.connections.map(([source, target], index) => ({
      id: `e${index}-${source}-${target}`,
      source,
      target,
      type: 'smoothstep',
      animated: true,
      style: { strokeWidth: 2, stroke: '#6b7280' },
    }));

    return getLayoutedElements(initialNodes, initialEdges);
  }, [stack]);


  return (
    <ReactFlow
      nodes={layoutedNodes}
      edges={layoutedEdges}
      nodeTypes={nodeTypes}
      fitView
      proOptions={{ hideAttribution: true }}
      nodesDraggable={false}
    >
      <Background />
      <Controls showInteractive={false} />
      <MiniMap />
    </ReactFlow>
  );
}; 