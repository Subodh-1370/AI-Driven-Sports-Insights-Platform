"""
Live Momentum Engine

Tracks and visualizes the momentum of the game (0-100 score)
based on various match factors.
"""
import streamlit as st
import numpy as np
import pandas as pd
from typing import Dict, List, Tuple, Optional
import plotly.graph_objects as go
from datetime import datetime, timedelta

class MomentumEngine:
    def __init__(self):
        self.momentum_data = []
        self.factors = {
            'runs': 0.4,
            'wickets': 0.3,
            'boundaries': 0.15,
            'dot_balls': 0.1,
            'partnership': 0.05
        }
        self.window_size = 10  # Number of balls to consider for momentum
        
    def update_momentum(self, ball_data: Dict) -> float:
        """Update momentum based on the latest ball data"""
        momentum_score = 50  # Neutral starting point
        
        # Calculate momentum based on different factors
        runs_factor = min(ball_data.get('runs', 0) * 5, 20)  # Cap at 20
        wickets_factor = -ball_data.get('wickets', 0) * 10  # Negative for wickets
        boundaries_factor = ball_data.get('is_boundary', 0) * 5
        dot_balls_factor = -1 if ball_data.get('is_dot', False) else 0
        
        # Update momentum score
        momentum_score += (
            runs_factor * self.factors['runs'] +
            wickets_factor * self.factors['wickets'] +
            boundaries_factor * self.factors['boundaries'] +
            dot_balls_factor * self.factors['dot_balls']
        )
        
        # Keep momentum within 0-100 range
        momentum_score = max(0, min(100, momentum_score))
        
        # Add timestamp and save
        self.momentum_data.append({
            'timestamp': datetime.now(),
            'momentum': momentum_score,
            'team': ball_data.get('team', 'Team A'),
            'over': ball_data.get('over', 0),
            'ball': ball_data.get('ball', 0),
            'batter': ball_data.get('batter', ''),
            'bowler': ball_data.get('bowler', ''),
            'runs': ball_data.get('runs', 0),
            'wicket': ball_data.get('wicket', False)
        })
        
        return momentum_score
    
    def get_momentum_trend(self, team: Optional[str] = None) -> pd.DataFrame:
        """Get momentum trend data for visualization"""
        df = pd.DataFrame(self.momentum_data)
        if not df.empty and team:
            df = df[df['team'] == team]
        return df
    
    def plot_momentum(self, team1: str, team2: str):
        """Generate an interactive momentum plot"""
        df1 = self.get_momentum_trend(team1)
        df2 = self.get_momentum_trend(team2)
        
        fig = go.Figure()
        
        if not df1.empty:
            fig.add_trace(go.Scatter(
                x=df1['over'] + df1['ball']/6,
                y=df1['momentum'],
                mode='lines+markers',
                name=team1,
                line=dict(color='#1f77b4', width=3),
                hovertemplate=
                    "<b>" + team1 + "</b><br>" +
                    "Over: %{x:.1f}<br>" +
                    "Momentum: %{y:.1f}<extra></extra>"
            ))
        
        if not df2.empty:
            fig.add_trace(go.Scatter(
                x=df2['over'] + df2['ball']/6,
                y=df2['momentum'],
                mode='lines+markers',
                name=team2,
                line=dict(color='#ff7f0e', width=3),
                hovertemplate=
                    "<b>" + team2 + "</b><br>" +
                    "Over: %{x:.1f}<br>" +
                    "Momentum: %{y:.1f}<extra></extra>"
            ))
        
        # Add match events as annotations
        if not df1.empty:
            for _, row in df1[df1['wicket']].iterrows():
                fig.add_annotation(
                    x=row['over'] + row['ball']/6,
                    y=row['momentum'],
                    text="W",
                    showarrow=True,
                    arrowhead=1,
                    ax=0,
                    ay=-40
                )
        
        fig.update_layout(
            title="Match Momentum Tracker",
            xaxis_title="Overs",
            yaxis_title="Momentum Score (0-100)",
            yaxis=dict(range=[0, 100]),
            hovermode="x unified",
            template="plotly_dark",
            margin=dict(l=20, r=20, t=40, b=20),
            height=400
        )
        
        return fig

def momentum_engine_page():
    """Streamlit page for the Momentum Engine"""
    st.title("⚡ Live Momentum Engine")
    st.markdown("Track the ebb and flow of the game with our real-time momentum tracker.")
    
    # Initialize session state
    if 'momentum_engine' not in st.session_state:
        st.session_state.momentum_engine = MomentumEngine()
    
    # Example UI
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("Current Momentum")
        st.metric("Team A", "65.2", "+2.1 from last over")
        st.metric("Team B", "48.7", "-1.3 from last over")
    
    with col2:
        st.subheader("Key Events")
        st.markdown("""
        - Wicket! (Over 12.3)
        - 6 runs! (Over 14.2)
        - 10-run over (Over 7)
        - Maiden over (Over 5)
        """)
    
    # Plot momentum
    st.subheader("Momentum Timeline")
    fig = st.session_state.momentum_engine.plot_momentum("Team A", "Team B")
    st.plotly_chart(fig, width='stretch')
    
    # Add controls
    with st.expander("Advanced Settings"):
        st.slider("Momentum Window Size", 1, 20, 10, 
                 help="Number of balls to consider for momentum calculation")
        st.checkbox("Show Detailed Ball-by-Ball", value=False)

if __name__ == "__main__":
    momentum_engine_page()
