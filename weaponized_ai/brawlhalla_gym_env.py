"""
BrawlhallaGymEnv: Modular RL environment for Brawlhalla, inspired by PokemonRedExperiments red_gym_env_v2.py.
- Framestacking, event/reward hooks, and map logic for Brawlhalla.
- Designed for integration with your RL agent and reward_shaper system.
"""
import uuid
import numpy as np
from gymnasium import Env, spaces

# Import your Brawlhalla-specific state extraction and reward shaping
from weaponized_ai.game_state_reader import extract_brawlhalla_state
from weaponized_ai.reward_shaper import AlignedRewardShaper

class BrawlhallaGymEnv(Env):
    def __init__(self, config=None):
        self.s_path = config.get("session_path")
        self.save_final_state = config.get("save_final_state", False)
        self.print_rewards = config.get("print_rewards", False)
        self.headless = config.get("headless", True)
        self.act_freq = config.get("action_freq", 1)
        self.max_steps = config.get("max_steps", 2048)
        self.frame_stacks = config.get("frame_stacks", 3)
        self.reward_scale = config.get("reward_scale", 1)
        self.instance_id = str(uuid.uuid4())[:8]
        self.reset_count = 0
        self.all_runs = []

        # Brawlhalla map logic: axes, platforms, blast zones, etc.
        self.map_config = config.get("map_config", {})
        self.axis_names = self.map_config.get("axes", ["x", "y"])
        self.platforms = self.map_config.get("platforms", [])
        self.blast_zones = self.map_config.get("blast_zones", {})

        # Action/observation space (customize as needed)
        self.action_space = spaces.Discrete(config.get("action_dim", 16))
        obs_shape = (84, 84, self.frame_stacks)  # Example: 84x84 grayscale, 3 frames
        self.observation_space = spaces.Dict({
            "frames": spaces.Box(low=0, high=255, shape=obs_shape, dtype=np.uint8),
            "player_state": spaces.Box(low=-np.inf, high=np.inf, shape=(8,), dtype=np.float32),
            "opponent_state": spaces.Box(low=-np.inf, high=np.inf, shape=(8,), dtype=np.float32),
            "map_features": spaces.Box(low=0, high=1, shape=(len(self.axis_names) + len(self.platforms),), dtype=np.float32),
            "recent_actions": spaces.MultiDiscrete([self.action_space.n] * self.frame_stacks)
        })

        self.reward_shaper = AlignedRewardShaper()
        self.recent_frames = np.zeros(obs_shape, dtype=np.uint8)
        self.recent_actions = np.zeros((self.frame_stacks,), dtype=np.uint8)
        self.step_count = 0
        self.total_reward = 0
        self.last_state = None

    def reset(self, seed=None, options={}):
        self.step_count = 0
        self.total_reward = 0
        self.recent_frames.fill(0)
        self.recent_actions.fill(0)
        # Reset game state (implement as needed)
        state = extract_brawlhalla_state(reset=True)
        self.last_state = state
        obs = self._get_obs(state)
        return obs, {}

    def step(self, action):
        # Send action to game (implement as needed)
        state = extract_brawlhalla_state(action=action)
        self._update_recent_frames(state["frame"])
        self._update_recent_actions(action)
        reward = self.reward_shaper.calculate_step_reward(
            state_dict=state,
            raw_env_reward=state.get("raw_reward", 0),
            yolo_opponent_detected=state.get("yolo_opponent_detected", False),
            image_match_audio_icon=state.get("image_match_audio_icon", False),
            shooting_event=state.get("shooting_event", False)
        )
        self.total_reward += reward
        self.step_count += 1
        obs = self._get_obs(state)
        done = self.step_count >= self.max_steps
        info = {}
        return obs, reward, False, done, info

    def _get_obs(self, state):
        # Compose observation dict
        obs = {
            "frames": self.recent_frames,
            "player_state": np.array(state.get("player_state", [0]*8), dtype=np.float32),
            "opponent_state": np.array(state.get("opponent_state", [0]*8), dtype=np.float32),
            "map_features": self._extract_map_features(state),
            "recent_actions": self.recent_actions
        }
        return obs

    def _update_recent_frames(self, frame):
        self.recent_frames = np.roll(self.recent_frames, 1, axis=2)
        self.recent_frames[:, :, 0] = frame

    def _update_recent_actions(self, action):
        self.recent_actions = np.roll(self.recent_actions, 1)
        self.recent_actions[0] = action

    def _extract_map_features(self, state):
        # Example: encode player position, platform presence, etc.
        features = []
        for axis in self.axis_names:
            features.append(state.get(f"player_{axis}", 0) / self.map_config.get(f"{axis}_max", 1))
        for plat in self.platforms:
            features.append(1.0 if state.get("on_platform") == plat else 0.0)
        return np.array(features, dtype=np.float32)
