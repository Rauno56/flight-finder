#[macro_use]
extern crate serde_derive;
use petgraph::{Graph, graph::NodeIndex};
use petgraph::algo::astar;
use wasm_bindgen::prelude::*;
extern crate web_sys;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// A macro to provide `println!(..)`-style syntax for `console.log` logging.
macro_rules! log {
    ( $( $t:tt )* ) => {
        web_sys::console::log_1(&format!( $( $t )* ).into());
    }
}

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[derive(Serialize, Debug)]
pub struct PathResult {
    pub cost: f64,
    pub path: Vec<String>,
}

#[wasm_bindgen]
#[derive(Debug)]
pub struct PathFinder {
    graph: Graph::<String, f64>,
}

#[wasm_bindgen]
impl PathFinder {
    pub fn new() -> PathFinder {
        PathFinder { graph: Graph::<String, f64>::new() }
    }

    fn ensure_node(&mut self, weight: String) -> NodeIndex {
        if let Some(node) = self.get_node(&weight) {
            return node;
        }
        self.graph.add_node(weight.to_string())
    }

    fn get_node(&self, weight: &String) -> Option<NodeIndex> {
        let _nodes = self.graph.raw_nodes();

        for i in self.graph.node_indices() {
            let node = self.graph.node_weight(i);
            if let Some(node_weight) = node {
                if *node_weight == *weight {
                    return Some(i)
                }
            }
        }
        None
    }

    #[wasm_bindgen(js_name = hasNode)]
    pub fn has_node(&self, weight: String) -> bool {
        self.get_node(&weight).is_some()
    }

    #[wasm_bindgen(js_name = addLink)]
    pub fn add_link(&mut self, from: String, to: String, distance: f64) {
        let from = self.ensure_node(from);
        let to = self.ensure_node(to);
        self.graph.add_edge(from, to, distance);
    }

    #[wasm_bindgen(js_name = findPath)]
    pub fn find_path(&mut self, from_weight: String, to_weight: String, only_count_hops: bool) -> JsValue {
        match (self.get_node(&from_weight), self.get_node(&to_weight)) {
            (Some(from), Some(to)) => {
                let result = {
                    if only_count_hops {
                        astar(&self.graph, from, |finish| finish == to, |_| 1.0, |_| 0.0)
                    } else {
                        astar(&self.graph, from, |finish| finish == to, |e| *e.weight(), |_| 0.0)
                    }
                };
                match result {
                    Some((cost, path)) => {
                        let node_weights: Vec<String> = path.iter().map(|idx| self.graph.node_weight(*idx).unwrap().to_owned()).collect();
                        JsValue::from_serde(&PathResult { cost, path: node_weights }).unwrap()
                    },
                    None => JsValue::NULL,
                }
            },
            _ => JsValue::NULL,
        }
    }

    pub fn show(&self) {
        log!("{:?}", self.graph);
    }
}
