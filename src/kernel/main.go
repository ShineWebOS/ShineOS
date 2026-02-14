package main

import (
	"fmt"
	"os"
	"strings"
)

func emit(line string) {
	fmt.Println(line)
}

func writeBootArtifact() error {
	if err := os.MkdirAll("/var/log", 0o755); err != nil {
		return err
	}
	return os.WriteFile("/var/log/shine-kernel.log", []byte("shine-kernel: boot complete\n"), 0o644)
}

func main() {
	emit("[kernel] ShineOS kernel (WASI module) booting")
	requestedABI := os.Getenv("SHINE_ABI")
	if requestedABI == "" {
		requestedABI = "wasi"
	}
	emit(fmt.Sprintf("[kernel] ABI request=%s (WASIX requires Wasmer runtime)", requestedABI))

	profile := os.Getenv("SHINE_PROFILE")
	if profile == "" {
		profile = "default"
	}
	emit(fmt.Sprintf("[kernel] profile=%s args=%s", profile, strings.Join(os.Args, " ")))

	if err := writeBootArtifact(); err != nil {
		fmt.Fprintf(os.Stderr, "[kernel] warning: cannot write /var/log/shine-kernel.log: %v\n", err)
	} else {
		emit("[kernel] wrote /var/log/shine-kernel.log")
	}

	emit("[kernel] handoff point reached (init/userland pending)")
}
