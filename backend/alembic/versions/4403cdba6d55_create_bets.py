"""create_bets

Revision ID: 4403cdba6d55
Revises: 92256e486744
Create Date: 2026-07-10 03:06:48.814648

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4403cdba6d55'
down_revision: Union[str, None] = 'a1b2c3d4e5f6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'bets',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('race_id', sa.Integer(), nullable=False),
        sa.Column('bet_type_id', sa.Integer(), nullable=False),
        sa.Column('amount', sa.Integer(), nullable=False),
        sa.Column('combination', sa.String(length=255), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['bet_type_id'], ['bet_types.id']),
        sa.ForeignKeyConstraint(['race_id'], ['races.id']),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_bets_id'), 'bets', ['id'], unique=False)
    op.create_index(op.f('ix_bets_race_id'), 'bets', ['race_id'], unique=False)
    op.create_index(op.f('ix_bets_bet_type_id'), 'bets', ['bet_type_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_bets_bet_type_id'), table_name='bets')
    op.drop_index(op.f('ix_bets_race_id'), table_name='bets')
    op.drop_index(op.f('ix_bets_id'), table_name='bets')
    op.drop_table('bets')
