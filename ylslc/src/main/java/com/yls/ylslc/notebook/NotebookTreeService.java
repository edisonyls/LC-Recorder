package com.yls.ylslc.notebook;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class NotebookTreeService {

    // Adds a root node to the content tree
    public void addRootNode(NotebookEntity notebook, NotebookNode node) {
        prepareNode(node);
        notebook.getContentTree().add(node);
    }

    // Finds a node by ID in the tree structure
    public NotebookNode findNodeById(NotebookEntity notebook, String nodeId) {
        return findNodeRecursive(notebook.getContentTree(), nodeId);
    }

    // Adds a child node to a parent node
    public boolean addChildNode(NotebookEntity notebook, String parentNodeId, NotebookNode childNode) {
        NotebookNode parent = findNodeById(notebook, parentNodeId);
        if (parent == null) {
            return false;
        }

        prepareNode(childNode);
        if (parent.getChildren() == null) {
            parent.setChildren(new java.util.ArrayList<>());
        }
        parent.getChildren().add(childNode);
        return true;
    }

    // Removes a node by ID from the tree structure
    public boolean removeNodeById(NotebookEntity notebook, String nodeId) {
        return removeNodeRecursive(notebook.getContentTree(), nodeId);
    }

    // Updates a node's name and/or content
    public boolean updateNode(NotebookEntity notebook, String nodeId, String name, String content) {
        NotebookNode node = findNodeById(notebook, nodeId);
        if (node == null) {
            return false;
        }

        if (name != null) {
            node.setName(name);
        }
        if (content != null) {
            node.setContent(content);
        }
        return true;
    }

    // Counts total nodes in the tree
    public int countNodes(NotebookEntity notebook) {
        return countNodesRecursive(notebook.getContentTree());
    }

    // Gets the level/depth of a specific node
    public int getNodeLevel(NotebookEntity notebook, String nodeId) {
        return getNodeLevelRecursive(notebook.getContentTree(), nodeId, 0);
    }

    // Private helper methods
    private void prepareNode(NotebookNode node) {
        if (node.getId() == null) {
            node.setId(UUID.randomUUID().toString());
        }
        if (node.getCreatedAt() == null) {
            node.setCreatedAt(LocalDateTime.now());
        }
        if (node.getChildren() == null) {
            node.setChildren(new java.util.ArrayList<>());
        }
        if (node.getOrderIndex() == null) {
            node.setOrderIndex(0);
        }
    }

    private NotebookNode findNodeRecursive(List<NotebookNode> nodes, String nodeId) {
        for (NotebookNode node : nodes) {
            if (node.getId().equals(nodeId)) {
                return node;
            }
            if (node.getChildren() != null) {
                NotebookNode found = findNodeRecursive(node.getChildren(), nodeId);
                if (found != null) {
                    return found;
                }
            }
        }
        return null;
    }

    private boolean removeNodeRecursive(List<NotebookNode> nodes, String nodeId) {
        for (int i = 0; i < nodes.size(); i++) {
            NotebookNode node = nodes.get(i);
            if (node.getId().equals(nodeId)) {
                nodes.remove(i);
                return true;
            }
            if (node.getChildren() != null && removeNodeRecursive(node.getChildren(), nodeId)) {
                return true;
            }
        }
        return false;
    }

    private int countNodesRecursive(List<NotebookNode> nodes) {
        int count = 0;
        for (NotebookNode node : nodes) {
            count++; // Count current node
            if (node.getChildren() != null) {
                count += countNodesRecursive(node.getChildren());
            }
        }
        return count;
    }

    private int getNodeLevelRecursive(List<NotebookNode> nodes, String nodeId, int currentLevel) {
        for (NotebookNode node : nodes) {
            if (node.getId().equals(nodeId)) {
                return currentLevel;
            }
            if (node.getChildren() != null) {
                int level = getNodeLevelRecursive(node.getChildren(), nodeId, currentLevel + 1);
                if (level >= 0) {
                    return level;
                }
            }
        }
        return -1;
    }
}
