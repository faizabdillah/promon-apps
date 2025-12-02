export interface DeploymentProvider {
    deploy(instanceId: string, image: string): Promise<string>; // returns containerId
    stop(containerId: string): Promise<void>;
    start(containerId: string): Promise<void>;
    delete(containerId: string): Promise<void>;
    getStatus(containerId: string): Promise<"RUNNING" | "STOPPED" | "UNKNOWN">;
}
